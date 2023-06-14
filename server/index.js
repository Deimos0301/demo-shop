const config = require('./config.json');
const express = require('express');
const path = require('path');
const { pool } = require('./sqldb');
const soap = require('soap');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
//const crypto = require('crypto');
const fs = require('fs');
const url = require('url');
// const Sequelize = require('sequelize');
var bodyParser = require('body-parser');

const app = express();

app.use(express.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({
    limit: '5mb',
    extended: true,
    parameterLimit: 50000
}));

app.use((req, res, next) => {
    if (req.headers.authorization) {
        jwt.verify(
            req.headers.authorization.split(' ')[1],
            tokenKey,
            (err, payload) => {
                if (err) next()
                else if (payload) {
                    for (let user of users) {
                        if (user.id === payload.id) {
                            req.user = user
                            next()
                        }
                    }

                    if (!req.user) next()
                }
            }
        )
    }

    next();
});

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, '../build')));

app.get('/api/getUser', (req, res) => {
    if (req.query.login) return res.status(200).json(req.query.login)
    else
        return res
            .status(401)
            .json({ message: 'Not authorized' })
});

const urlencodedParser = express.urlencoded({ extended: true });

const tokenKey = '6b4b-3c4e-5e66-7g8h';

verifyToken = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, tokenKey, (err, decoded) => {
            if (err)
                reject(err);
            else
                resolve(true);
        });
    });

}

app.post('/api/verifyToken', urlencodedParser, async (req, res) => {
    let r;
    let msg = 'Token verified successfully!';

    try {
        r = await verifyToken(req.body.token);
    } catch (e) {
        msg = e;
    }

    if (r === true)
        res.status(200).json({ status: 'OK', message: msg });
    else
        res.status(511).json({ status: 'FAIL', message: 'Token expired!' });
});

app.post('/api/getAuth', urlencodedParser, async (req, res) => {
    const r = await pool.query('select "getTokenByLogin"($1) as token', [req.body.login]);
    let token;
    if (r.rows)
        token = r.rows[0].token;

    const rows = await pool.query('select * from "getUserInfo"($1, $2, $3) where IsActive = true', [req.body.user_id, req.body.login, req.body.password]);
    if (rows.rows && rows.rows.length > 0) {
        if (!token)
            token = jwt.sign({ user_id: rows.rows[0].user_id }, tokenKey, { expiresIn: '12h' });

        let D = new Date();

        await pool.query('call "tokenInsert"($1, $2, $3)', [token, rows.rows[0].user_id, D.addHours(12)]);

        return res.status(200).json({
            user_id: rows.rows[0].user_id,
            login: rows.rows[0].login,
            token: token
        });
    }

    return res.status(511).json({ message: 'Invalid username or password!' });
})

app.post('/api/getUserInfo', urlencodedParser, async (req, res) => {
    const rows = await pool.query('select * from "getUserInfo"($1, $2, $3)', [req.body.user_id, req.body.login, req.body.password]);

    return res.json(rows.rows);
});

app.post('/api/getUserInfoByToken', urlencodedParser, async (req, res) => {
    const rows = await pool.query('select * from "getUserInfoByToken"($1)', [req.body.token]);

    return res.json(rows.rows);
});

app.post('/api/usersUpdate', urlencodedParser, async (req, res) => {
    await pool.query('call "usersUpdate"($1)', [JSON.stringify(req.body.data)]);

    res.end("done");
});

app.post('/api/checkUserExists', urlencodedParser, async (req, res) => {
    const rows = await pool.query('select * from "checkUser"($1)', [req.body.data]);

    return res.json(rows.rows);
});

app.post('/api/usersInsert', urlencodedParser, async (req, res, next) => {
    if (typeof req.body.data === 'string')
        req.body.data = JSON.parse(req.body.data);

    const pa = url.parse(req.body.origin);

    const origin = pa.protocol + '//' + pa.hostname + ':' + config.port + '/api/confirm?token=';
    const email = req.body.data.email;

    req.body.data = [req.body.data];

    try {
        const ch = await pool.query('select * from "checkUser"($1)', [req.body.data[0].login]);
        //console.log(req.body.data)
        if (ch.rows.length > 0)
            throw new Error('Учетная запись с такими параметрами уже существует!');
        const rows = await pool.query('select * from "usersInsert"($1)', [JSON.stringify(req.body.data)]);
        const token = jwt.sign({ user_id: rows.rows[0].user_id }, tokenKey, { expiresIn: '12h' });

        let D = new Date();
        await pool.query('call "tokenInsert"($1, $2, $3)', [token, rows.rows[0].user_id, D.addHours(12)]);
        await sendMail(email, "Для подтверждения регистрации перейдите по следующей ссылке:<br/> " + origin + token);

        res.status(200).send({ message: "На указанный Email выслано сообщение о подтверждении регистрации" });
    }
    catch (e) {
        res.status(531).send({ message: e.message });
    }
});

app.get('/api/confirm*', urlencodedParser, async (req, res) => {
    const token = req.query.token;
    await pool.query('update users set IsActive = true where User_ID = (select User_ID from Token t where t.token = $1)', [token]);
    const rows = await pool.query('select * from "getUserInfoByToken"($1) where IsActive = true', [token]);
    res.status(200).send(rows.rows.length > 0 ? 'Учетная запись подтверждена!' : 'Ошибка при подтверждении!');
});

app.post('/api/userChangePassword', urlencodedParser, async (req, res) => {
    await pool.query('call "userChangePassword"($1, $2)', [req.body.user_id, req.body.password]);

    res.end("done");
});

// Handles any requests that don't match the ones above
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build/index.html'));
});

app.all('/*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, x-access-token');
    res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
    next();
});

app.post('/api/getCategories', urlencodedParser, async (req, res) => {
    const withBrands = !req.body.withBrands || req.body.withBrands === 'true';
    const rows = await pool.query(`select * from "getCategories"($1)`, [withBrands]);
    res.json(rows.rows);
});

app.post('/api/getCategoriesJson', urlencodedParser, async (req, res) => {
    const rows = await pool.query(`select * from "getCategoriesJson"()`);
    res.json(rows.rows);
});


pack = (data) => {
    const childs = id =>
        data.filter(item => item.parent_id === id)
            .map(
                ({ id, name, category_id, brand_id, iscat }) => ({ id, name, category_id, brand_id, iscat, items: childs(id) })
            ).map(
                ({ id, name, category_id, brand_id, iscat, items }) => items.length ? { id, name, category_id, brand_id, iscat, items } : { id, name, category_id, brand_id, iscat }
            );
    return childs(0);
}

//   console.log(JSON.stringify(pack(rawData, 1, 4)));

app.post('/api/getCategories2', urlencodedParser, async (req, res) => {
    const rows = await pool.query(
        `select id, name, Coalesce(parent_id,0) as parent_id, category_id, brand_id, iscat 
        from "getCategories"(${!req.body.withBrands || req.body.withBrands === 'true' ? true : false})`);

    const pa = pack(rows.rows);

    res.json(pa);
});

app.post('/api/getProducts', urlencodedParser, async (req, res) => {
    //console.log(req.body);
    const rows = await pool.query('select * from "getProducts"($1, $2, $3)', [req.body.category_id, req.body.brand_id, req.body.product_id]);
    res.json(rows.rows);
});

app.post('/api/getProductHits', urlencodedParser, async (req, res) => {
    const rows = await pool.query('select * from "getProductHits"()', []);
    res.json(rows.rows);
});

app.post('/api/getNews', urlencodedParser, async (req, res) => {
    const rows = await pool.query('select * from "getNews"()', []);
    res.json(rows.rows);
});

app.post('/api/newsUpdate', urlencodedParser, async (req, res) => {
    await pool.query('call "newsUpdate"($1, $2, $3, $4)', [req.body.news_id, req.body.news_short, req.body.news_text, req.body.news_date]);
    res.end('done');
});

app.post('/api/newsInsert', urlencodedParser, async (req, res) => {
    await pool.query('call "newsInsert"($1, $2, $3)', [req.body.news_short, req.body.news_text, req.body.news_date]);
    res.end('done');
});

app.post('/api/newsDelete', urlencodedParser, async (req, res) => {
    await pool.query('delete from news where news_id = $1', [req.body.news_id]);
    res.end('done');
});

app.post('/api/getProductDesc2', urlencodedParser, async (req, res) => {
    const rows = await pool.query('select * from "getProductDesc"($1)', [req.body.product_id]);
    //console.log(rows.rows);
    res.json(rows.rows);
});

app.post('/api/getProductDesc', urlencodedParser, async (req, res) => {
    //console.log(req.body);
    const rows = await pool.query('select * from "getProductDesc"($1)', [req.body.product_id]);
    let group = ''; //rows.rows[0].group_name;

    let arr = [];

    rows.rows.map((row) => {
        if (row.group_name !== group) {
            obj = new Object();

            obj.group_name = row.group_name;
            obj.attribs = [];
            arr.push(obj);

            group = row.group_name;
        }

        //console.log(row.group_name,  row.attr_name);
        obj.attribs.push({ attr_name: row.attr_name, value: row.value });
    });
    //console.log(arr);
    res.json(arr);
    //res.end('done');
});

app.post('/api/basketInsert', urlencodedParser, async (req, res) => {
    const host = req.ip.split(':')[3];

    //console.log(host, req.body)
    await pool.query('call public."BasketInsert"($1, $2, $3, $4)', [host, req.body.product_id, req.body.quantity, req.body.user_id]);

    res.end("done");
});

app.delete('/api/basketDelete', async (req, res) => {
    await pool.query('call public."BasketDelete"($1)', [req.body.basket_id]);

    res.end("done");
});

app.put('/api/basketUpdate', urlencodedParser, async (req, res) => {
    //console.log(host, req.body)
    await pool.query('call public."BasketUpdate"($1, $2)', [req.body.basket_id, req.body.quantity]);

    res.end("done");
});

app.post('/api/getBasket', urlencodedParser, async (req, res) => {
    const host = req.ip.split(':')[3];
    const rows = await pool.query('select * from public."getBasket"($1, $2)', [host, req.body.user_id]);

    res.json(rows.rows);
});

app.post('/api/load3Logic', urlencodedParser, async (req, res) => {
    const rows = await pool.query('select ltr_Category_ID from public.Category where ltr_Category_ID is not NULL');
    let arr = [];
    rows.rows.map((item) => { arr.push(item.ltr_category_id) });

    if (arr.length > 0)
        await load3Logic(arr);

    res.end("done");
});


//const urlLogic = 'http://www.cbr.ru/DailyInfoWebServ/DailyInfo.asmx?WSDL';
//const urlLogic = 'http://www.thomas-bayer.com/axis2/services/BLZService?wsdl';

const urlLogic = 'https://3logic.ru/ws/soap/soap.php?wsdl';


getToday = (client) => {
    return new Promise((resolve, reject) => {
        client.getToday({ str: 'Hello' }, (err, res) => {
            if (err) reject(err);
            else {
                console.log(res.return.$value);
                resolve(res);
            }
        });
    });
}

getBrands = (client) => {
    return new Promise((resolve, reject) => {
        let brandArr = [];

        client.getBrandList(null, (err, result) => {

            result.return.item.map((item) => {
                brandArr.push({ brand_id: item.brand_id.$value, brand_name: item.brand_name.$value ? item.brand_name.$value : '<Не определено>' })
            });

            if (err) reject(err);
            else {
                resolve(brandArr);
            }
        });
    });
}

getCategories = (client, categoryArr) => {
    return new Promise((resolve, reject) => {
        client.getCategoryList(null, (err, result) => {
            let arr = [];

            if (err) reject(err);
            else {
                result.return.item.map((item) => {
                    if (categoryArr.indexOf(item.category_id.$value) != -1)
                        arr.push({
                            category_id: item.category_id.$value,
                            category_name: item.category_name.$value ? item.category_name.$value : '<Не определено>',
                            parent_id: item.parent_id ? item.parent_id.$value : null,
                            orderno: item.category_id.$value,
                            iscat: item.iscat.$value
                        });
                });
                resolve(arr);
            }
        });
    });
}

getProductDescription = (client, category_id) => {
    return new Promise((resolve, reject) => {
        client.getProductDescriptionA_category({ category_id: category_id }, (err, result) => {
            let arr = [];

            if (err) reject(err);
            else {
                if (result.return.item && Array.isArray(result.return.item)) {
                    result.return.item.map((item) => {
                        arr.push({
                            attribute_id: item.id.$value,
                            product_id: item.mat_id.$value,
                            value: item.val.$value ? item.val.$value : null
                        });
                    });
                }
                resolve(arr);
            }
        });
    });
}

getProductList = (client, category_id) => {
    return new Promise((resolve, reject) => {
        client.getProductList({ category_id: category_id, withImageLinks: true, withDescription: true }, (err, result) => {
            let arr = [];

            if (err) reject(err);
            else {
                if (result.return.item && Array.isArray(result.return.item))
                    result.return.item.map((item) => {
                        arr.push({
                            category_id: item.category_id.$value,
                            subcategory_id: item.subcategory_id ? item.subcategory_id.$value : null,
                            brand_id: item.brand_id.$value,
                            product_id: item.product_id.$value,
                            product_dealer_id: item.product_dealer_id.$value ? item.product_dealer_id.$value : null,
                            currency_name: item.currency_name.$value,
                            product_price_retail: item.product_price_retail.$value,
                            product_price_dealer: item.product_price_dealer.$value,
                            product_no_price: item.product_no_price.$value,
                            product_is_custom: item.product_is_custom.$value,
                            product_full_name: item.product_full_name.$value.replace('&quot', '"'),
                            product_model: item.product_model ? item.product_model.$value : null,
                            product_partnumber: item.product_partnumber.$value,
                            product_remain: item.product_remain.$value,
                            product_remain_addinf: item.product_remain_addinf.$value,
                            product_image_main: item.product_image_main.$value,
                            product_image_short: item.product_image_short.$value,
                            product_image_additional: item.product_image_additional.$value,
                            product_description: item.product_description.$value ? item.product_description.$value.replace('&quot', '"') : null,
                            product_prepay_percent: item.product_prepay_percent.$value,
                            product_weight: item.product_weight.$value,
                            product_length: item.product_length ? item.product_length.$value : null,
                            product_width: item.product_width ? item.product_width.$value : null,
                            product_height: item.product_height ? item.product_height.$value : null,
                            product_packqty: item.product_packqty.$value,
                            product_volume: item.product_volume.$value,
                            product_warranty: item.product_warranty.$value,
                            product_changedate: item.product_changedate.$value,
                            product_retailname: item.product_retailname.$value
                        });
                    });
                resolve(arr);
            }
        });
    });
}

getCurrencyRate = (client) => {
    return new Promise((resolve, reject) => {
        client.getCurrencyRate(null, (err, result) => {
            let arr = [];

            if (err) {
                reject(err);
            }
            else {
                arr.push({
                    date: result.date.$value,
                    value: result.value.$value
                });
                resolve(arr);
            }
        });
    });
}

getClassifierAttributeGroupList = (client, category_id) => {
    return new Promise((resolve, reject) => {
        client.getClassifierAttributeGroupList({ category_id: category_id }, (err, result) => {
            if (err) {
                console.log('rejected category: ', category_id);
                reject(err);
            }
            else {
                let arr = [];

                if (result && result.return && result.return.item && Array.isArray(result.return.item)) {
                    result.return.item.map((item) => {
                        arr.push({
                            group_id: item.group_id.$value,
                            group_name: item.group_name.$value ? item.group_name.$value : '<Не определено>'
                        });
                    });
                }
                //console.log(arr);
                resolve(arr);
            }
        });
    });
}

getClassifierAttributeList = (client, category_id) => {
    return new Promise((resolve, reject) => {
        client.getClassifierAttributeList({ category_id: category_id }, (err, result) => {
            if (err) {
                console.log('rejected category: ', category_id);
                reject(err);
            }
            else {
                let arr = [];
                if (result && result.return && result.return.item && Array.isArray(result.return.item)) {
                    result.return.item.map((item) => {
                        if (item.attribute_id)
                            arr.push({
                                attribute_id: item.attribute_id.$value,
                                category_id: item.category_id.$value,
                                attr_group_id: item.attr_group_id ? item.attr_group_id.$value : null,
                                attr_isvirtual: item.attr_isvirtual.$value,
                                attr_parent_attribute_id: item.attr_parent_attribute_id ? item.attr_parent_attribute_id.$value : null,
                                attr_name: item.attr_name.$value,
                                attr_type: item.attr_type.$value,
                                attr_unit_name: item.attr_unit_name.$value,
                                attr_note: item.attr_note.$value,
                                attr_islist: item.attr_islist.$value,
                                attr_filter: item.attr_filter.$value
                            });
                    });
                }
                resolve(arr);
            }
        });
    });
}

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

load3Logic = async (enabledCategories) => {
    const client = await soap.createClientAsync(urlLogic);
    client.setSecurity(new soap.BasicAuthSecurity(config.ltr.login, config.ltr.password));
    await getToday(client);

    await pool.query('begin');

    try {
        //console.log(await getProductList(client, 54));
        console.log('Cleaning...');
        await pool.query('call ltr.clean()');
        console.log('Loading brands...');
        const brandArr = await getBrands(client);
        await pool.query('call ltr.brand_insert($1)', [JSON.stringify(brandArr)])
        console.log('Loading categories...');
        const categoryArr = await getCategories(client, enabledCategories);
        await pool.query('call ltr.category_insert($1)', [JSON.stringify(categoryArr)]);

        console.log('Loading category attrib groups...');
        for (let i = 0; i < categoryArr.length; i++) {
            let cat = categoryArr[i];
            //console.log(cat.category_id, cat.category_name);
            const groupArr = await getClassifierAttributeGroupList(client, cat.category_id);
            //console.log(groupArr.length);
            if (groupArr && Array.isArray(groupArr) && groupArr.length > 0)
                await pool.query('call ltr.category_atrib_group_insert($1, $2)', [JSON.stringify(groupArr), cat.category_id]);
            await timeout(1);
        }

        console.log('Loading category attributes...');
        for (let i = 0; i < categoryArr.length; i++) {
            let cat = categoryArr[i];
            //console.log(cat.category_id, cat.category_name);
            const atribArr = await getClassifierAttributeList(client, cat.category_id);
            if (atribArr && Array.isArray(atribArr) && atribArr.length > 0)
                await pool.query('call ltr.category_atrib_insert($1, $2)', [JSON.stringify(atribArr), cat.category_id]);
            await timeout(1);
        }

        console.log('Loading products...');
        for (let i = 0; i < categoryArr.length; i++) {
            let cat = categoryArr[i];
            //console.log(cat.category_id, cat.category_name);
            const arr = await getProductList(client, cat.category_id);
            //console.log(arr);
            if (arr && Array.isArray(arr) && arr.length > 0)
                await pool.query('call ltr.product_insert($1)', [JSON.stringify(arr)]);
            await timeout(1);
        }

        console.log('Loading attribute values...');
        for (let i = 0; i < categoryArr.length; i++) {
            let cat = categoryArr[i];
            //console.log(cat.category_id, cat.category_name);
            const arr = await getProductDescription(client, cat.category_id);

            if (arr && Array.isArray(arr) && arr.length > 0) {
                //                await fs.writeFile('E:\\Downloads\\php\\a.json', JSON.stringify(arr, null, 4), (err) => {console.log(err)});
                await pool.query('call ltr.category_atrib_value_insert($1)', [JSON.stringify(arr)]);
            }
            await timeout(1);
        }

        const curr = await getCurrencyRate(client);
        await pool.query(`
          insert into ltr.currency_rate (date, value) 
          select $1, $2
          where not exists (select 1 from ltr.currency_rate where date = $3)`, [curr[0].date, curr[0].value, curr[0].date]);
        //console.log(curr);

        await pool.query('commit');
        console.log('Success!');
    }
    catch (err) {
        console.log('Rolling back...');
        await pool.query('rollback');
        throw err;
    }
    //console.log(categoryArr.length);
}

Date.prototype.addHours = function (h) {
    this.setTime(this.getTime() +
        (h * 60 * 60 * 1000));
    return this;
}


const sendMail = async (to, content) => {
    //    let testEmailAccount = await nodemailer.createTestAccount();

    let transporter = nodemailer.createTransport({
        host: config.mail.smtp,
        port: config.mail.port,
        secure: true,
        auth: {
            user: config.mail.user,
            pass: config.mail.pass,
        },
    });


    let result = await transporter.sendMail({
        from: '"Demo-Shop" <webmaster@mxhome.ru>',
        to: to,
        subject: 'Authorization confirm',
        text: '',
        html: content
        //'This <i>message</i> was sent from <strong>Node js</strong> server.',
    });

    //console.log(result);
};


//sendMail('holopov@inform48.ru', 'Раз-два-три');
//load3Logic([71, 56, 113, 237, 69]);

app.listen(config.port);


console.log(`App is listening on port ${config.port}`);

// const sequelize = new Sequelize('3logic', 'web', 'web', {
//     host: 's48-svn',
//     dialect: 'postgres'
// });

// (async () => {
//     await sequelize.authenticate();
//     console.log('Соединение с БД было успешно установлено')
// }
// )();