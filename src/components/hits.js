import { React, Component } from "react";
import { Link } from "react-router-dom";
import './Style/hits.css'

class Hits extends Component {
    constructor(props) {
        super(props)
        this.state = {
            divs: [],
        }
    }

    getProductHits = async () => {
        const arr = await fetch('/api/getProductHits', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({})
        });

        return await arr.json();
    }


    formatter = new Intl.NumberFormat("ru", {
        style: "currency",
        currency: "RUB",
        minimumFractionDigits: 0
    });


    componentDidMount = async () => {
        const hits = await this.getProductHits();
        console.log(hits)
        let divs = [];

        hits.map(hit => {
            const href = `/product?product_id=${hit.product_id}`;
            divs.push(
                <Link to={href} style={{textDecoration: "none"}}>
                    <div className="hit-item" prodinfo={hit} key={hit.product_id} style={{color: 'black'}}>
                        <div className="prod_ph" style={{ backgroundImage: `url(${hit.image_prefix + hit.product_image_main})`, backgroundRepeat: 'no-repeat', backgroundSize: '100% 100%', marginTop: '10px', width: '130px', height: '130px' }} />
                        <div className="prod__desc">
                            {hit.category_name} {hit.brand_name} {hit.product_partnumber}
                        </div>
                        <ul className="prod__addInfo">
                            <li className="prod__addInfo-item">Артикул: {hit.product_articul}</li>
                            <li className="prod__addInfo-item">{hit.product_retailname}</li>
                        </ul>
                        <div className="prod__price" style={{ textAlign: 'right', fontSize: '18px', fontWeight: '600' }}>Цена: {hit.product_price_retail_rub ? this.formatter.format(hit.product_price_retail_rub.toFixed(0)) : ''}</div>
                    </div>
                </Link>)
        })
        this.setState({ divs: divs });
    }

    render() {
        let formatter = new Intl.NumberFormat("ru", {
            style: "currency",
            currency: "RUB",
            minimumFractionDigits: 0
        });
        return (
            <div className="hits__items">{this.state.divs}</div>
        )
    }
}

export default Hits;