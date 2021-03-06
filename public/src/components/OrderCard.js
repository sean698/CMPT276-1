import React, { Component } from 'react';
import axios from 'axios';
// import {toast} from 'react-toastify';
import '../css/orderCard.scss';
import { sendAccepted } from "../globalFunc/Socket";
// address: "CF Richmond Centre, Number 3 Road, Richmond, BC, Canada"
// complete: false
// latLng: {lat: 49.1672705, lng: -123.1384481}
// phone: "+16047263370"
// products: Array(2)
// 0:
    // id: "276188"
    // image: "http://www.bcliquorstores.com/sites/default/files/imagecache/height400px/276188.jpg"
    // name: "CARLSBERG TALL CAN"
    // price: 2.29
    // quantity: 2
// 1:
    // id: "410167"
    // image: "http://www.bcliquorstores.com/sites/default/files/imagecache/height400px/410167.jpg"
    // name: "CANNERY BREWING - VARIETY PACK 6 CANS"
    // price: 11.99
    // quantity: 1
// stripeToken: "tok_1H7DFdIWCPZAHnFyUSCzfTyc"
// timestamp: 1595306329
// __v: 0
// _id: "5f16715c9b96a33e57706898"

class OrderCard extends Component {
    constructor(props){
        super(props)
        console.log(this.props.json)
        var total = 0;
        for(var x in this.props.products) {
          var cProd = this.props.products[x];
          total += cProd.quantity * cProd.price;
        }
        this.state = {
          directions: null,
          total: "$"+total.toFixed(2),
          accepted: false,
      }
    }
    componentDidMount(){
        if(this.props.current) {
            new window.google.maps.DirectionsService().route({
                origin: new window.google.maps.LatLng(this.props.current.lat,this.props.current.lng),
                destination: new window.google.maps.LatLng(this.props.latLng.lat,this.props.latLng.lng),
                travelMode: window.google.maps.TravelMode.DRIVING,
              }, (result, status) => {
                if (status === window.google.maps.DirectionsStatus.OK) {
                  this.setState({
                    directions: result,
                    time: result.routes[0].legs[0].duration.text,
                    distance: result.routes[0].legs[0].distance.text
                  });
                } else {
                  this.setState({
                    directions: null,
                  });
                }
              });
        }

    }
    componentDidUpdate(prevProps){
      console.log(this.props.current)
        if(prevProps.current != this.props.current) {
            new window.google.maps.DirectionsService().route({
                origin: new window.google.maps.LatLng(this.props.current.lat,this.props.current.lng),
                destination: new window.google.maps.LatLng(this.props.latLng.lat,this.props.latLng.lng),
                travelMode: window.google.maps.TravelMode.DRIVING,
              }, (result, status) => {
                if (status === window.google.maps.DirectionsStatus.OK) {
                  this.setState({
                    directions: result,
                    time: result.routes[0].legs[0].duration.text,
                    distance: result.routes[0].legs[0].distance.text
                  });
                } else {
                  this.setState({
                    directions: null,
                  });
                //   console.error(`error fetching directions ${result}`);
                }
              });
        }
    }
    sendDetails = () => {
       axios.post('api/orders/acceptOrder', {stripeToken:this.props.stripeToken,
        phone:this.props.phone,
        driver:this.props.driver.phoneNumber
      })
    }
    refreshMap = () =>{
        this.props.updateLatLng(this.props.latLng)
        this.props.updateBounds(this.props.latLng);
    }
    accept = () => {
      this.setState({
        accepted:true
      })
      this.props.acceptOrder(this.props.json);
      sendAccepted(this.props.phone)
    }
    render() {
        const isAccepted = this.props.allOrders.find(({ stripeToken }) => stripeToken === this.props.stripeToken && this.state.accepted);

        return (
           <div className="orderCard" onClick={()=>{this.refreshMap()}}>
               <div className="order-info">
                    {
                        this.props.products.map(p => {
                            return (
                                <div className="pdct-info" key={p.id}>
                                    <div className="order-image-wrapper">
                                      <img className="order-image" src={p.image} />
                                    </div>
                                    <div className="order-text">
                                        <p><strong>Name: </strong>{ p.name}</p>
                                        <p><strong>Price: </strong>{"$" + p.price}</p>
                                        <p><strong>Quantity: </strong>{ p.quantity}</p>
                                    </div>
                                </div>
                            )
                        })
                    }
                    <div className="order-total">
                      <p><strong>Total: </strong>{this.state.total}</p>
                    </div>
                    <p><strong>Estimated Driving Time: </strong>{this.state.directions && this.state.time}</p>
                    <p><strong>Estimated Distance: </strong>{this.state.directions && this.state.distance}</p>
                    <p className="order-addr"><strong>Address: </strong><span>{this.props.address}</span></p>
               </div>
               <button className="button order-button" onClick={()=>{
                 this.sendDetails();
                 this.refreshMap();
                 this.accept()
               }} disabled={!!isAccepted ? true:false}>Accept{!!isAccepted ? "ed": ""}</button>
           </div>
        )
    }
}

export default OrderCard;
