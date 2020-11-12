import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import { appSiteService } from '../_services';
import { Image } from 'react-bootstrap';

const baseImageUrl = `${process.env.REACT_APP_STORAGE_URL}/`;
 
const AnyReactComponent = ({ imageUrl }) => <div><Image src={baseImageUrl+imageUrl} /></div>;
 
class SimpleMap extends Component {
  static defaultProps = {
    center: {
      lat: 59.95,
      lng: 30.33
    },
    zoom: 22
  };

  constructor(props){
      super(props);
      this.state = {
          appSite: {
              appSiteId: props.appSiteId,
              name: '',
              latitude: 0,
              longitude: 0,
              companyLogo: 'logo.png'
          },
          zoom: 15
      }
  }

  componentDidMount() {
      this.getAppSite();
  }

  getAppSite() {
    appSiteService.getAppSiteById(this.state.appSite.appSiteId)
        .then((_appSite) => this.setState({ appSite: _appSite }));
  }
 
  render() {
    return (        
      <div className="simple-map">
            {this.state.appSite.latitude > 0 && this.state.appSite.longitude > 0 &&
              <div style={{ height: '50vh', width: '100%' }}>
                <p>{this.state.appSite.address} - {this.state.appSite.city} {this.state.appSite.postalCode}</p>
                <GoogleMapReact
                  bootstrapURLKeys={{ key: 'AIzaSyDjhhyvk_-edBnpfSNu9IkZCc7203kM7no' }}
                  defaultCenter={[this.state.appSite.latitude, this.state.appSite.longitude]}
                  defaultZoom={this.state.zoom}
                >
                  <AnyReactComponent
                    lat={this.state.appSite.latitude}
                    lng={this.state.appSite.longitude}
                    imageUrl={this.state.appSite.companyLogo}
                  />
                </GoogleMapReact>                
              </div>                
            }        
      </div>
    );
  }
}
 
export { SimpleMap };