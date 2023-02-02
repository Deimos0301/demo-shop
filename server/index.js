const config = require('./config.json');
const express = require('express');
const path = require('path');
const { pool } = require('./sqldb');
const soap = require('soap');

const app = express();

app.use(express.json());

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, '../build')));

//An api endpoint that returns a short list of items
// app.post('/api/getList', (req, res) => {
//     var list = [{scenariopage_name:"Вася"}, {scenariopage_name:"Петя"}, {scenariopage_name:"Вова"}];
//     res.json(list);
//     //res.end(JSON.stringify(list));
//     console.log(list);
// });

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

app.listen(config.port);

const urlencodedParser = express.urlencoded({ extended: true });

app.post('/api/getCategories', urlencodedParser, async (req, res) => {
    const rows = await pool.query('select * from "getCategories"()');
    //await pool.query('select * from users');
    console.log(req.body);
    res.json(rows.rows);
});

app.post('/api/getAuth', urlencodedParser, async (req, res) => {
    const rows = await pool.query('select * from users where Upper(login) = Upper($1) and password = md5($2)', [req.body.login, req.body.password]);
    console.log(rows.rows);
    if (rows.rows && rows.rows.length > 0)
        res.end("true");
    else
        res.end('false');
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
                            orderno: item.category_id.$value
                        });
                });
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

loadWSDL = async (enabledCategories) => {
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

//loadWSDL([71, 56, 113, 237, 69]);

console.log(`App is listening on port ${config.port}`);
