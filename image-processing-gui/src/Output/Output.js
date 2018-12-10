import React, { Component, Fragment} from 'react';
import {Redirect} from 'react-router-dom';
import axios from 'axios';
import {connect} from 'react-redux';

import * as actionCreators from '../store/actions/userInfo';
import * as actionCreator from '../store/actions/returnedData';
import Loader from '../UI/Loader';
import Results from './Results';
import FileSaver from 'file-saver';


class Output extends Component {
    state={
        loading:false
    }

    componentWillMount(){
        if (this.props.sentStatus&&!this.props.hasData){
            console.log("initializing get data")
            this.retrieveData();
        }
        let pairs = [["b'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",
            "b'/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxMSEhUTExMVFRUWFxUVGBUVFxcVFRYVFRUWFhUVFRUYHSggGBolHRUVITEhJSkrLi4uFx8zODMtNygtLisBCgoKDg0OGhAQGi0lHyUtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLf/AABEIAOAA4QMBIgACEQEDEQH/xAAbAAACAwEBAQAAAAAAAAAAAAADBAIFBgEAB//EAD4QAAEDAgUBBgQEBAMJAQAAAAEAAhEDIQQFEjFBUQYiYXGBkROhsfAywdHhFEJS8WKCohUjJHKSssLS4gf/xAAZAQADAQEBAAAAAAAAAAAAAAAAAQIDBAX/xAAmEQACAgMBAAICAQUBAAAAAAAAAQIRAyExEgRBE1EiMkJScYEU/9oADAMBAAIRAxEAPwD6lgirIFV1IQnWuXPHhZIrmpRc5RLk7HQT4ii56GuEpBR1z1HUoOK5KBkiVzWl6+Ka3lUeY5+1nKVmuPDKfC9r4sN3KoMz7QNbystmPaB9QwxL4fKKtYy6bqHK+HasGPEryMbxWevqGGSo4fKqlUy6VoMp7OtZEhaOhhGtFgmo/syyfLfIKkZzLezwHC0mFwbW8I7WKSpKjjcm+kpAWR7U5q5xNKmYaPxOG58BHCtO0GZfCYY/EbDz5Pp+YWMbWm26yyTrRrjg3sv+xeMcHOpOMgjU2TJBG49vote2ovnGBqaa9JzeHNG+8mCI8ivoKeF/xFmVSGHPQXuU2qLwtTEGvQpBq45AHoXCFwOQK+JDdygpRb4NhwQ6uKa3crOZj2gawG6yOYdp3vOll1LmkdmL4MpblpH0b/arOq8vlX8TiV1T+Q3/APJi/wAkfZWtRhZcK4VoeXRxxUCUUBccEARDlFzkOtiGtG6oM07QMZyk3RtjwSm9Iu62KDdyqPMs+azlZLMM/qVDDAULBZTVqmXyo9Xw7Vgx4lc2MY7PX1DDELCZRUqmXStPl3Z5rRcK+w+Da3YJqN9MZ/LfIKjPZf2ca2LLQYXBtbwmdKkAro45Sb6cDQuhS0rhQSSlKY3E6bC7jsFHE4sM5uqTMMWQ1z93u7jR0td3tb1WM8n9qNoY/tlF2gx3xKpAMhlgep5PulBUa0Xv4dfdeZT02FvMgyo1ZPN+t/os1s2TCYbERVpkggB7bRAF19M0r5KQWwdU+kfqvqmXVxUpMeLhzQfktMWrRnn4mMMavOU5S+IxAG5W5gk3wLKBVxDRuVUZhnbWA3WMzbtSSSGSfJQ5JHbh+FKe3w1+Z561g3WLzXtM55IZJSGHwdbEGXTC1GU9lQLkKP5SOl5MODUdsy2Gy2tXMumFp8q7LgQSFrMHlLWxZWtPDqlBI4s3yp5OszX+xB0XlpvhLyujnsYIQiUDEYsN3KoM07RsYN0GuLBOfEaCriQ3lUWbdoWsBuFjMy7TvqGKYPmk8NlNasZeSoc/0dq+PjxK8j/4afGZ7T+D8R0kk6WgWLjE7+Sy78RSqGXMeP8APq+WlN9psAaNKiItL/fuqnpPHK55SaexQk2m4ukazIxhTbWGno6x9Dstlg8GwCRC+SkgjY/VW+U59WoQJ1N5aenvZXHJXUc+TFe0z6eGKRYs7lnadlazSNXLXWPodirEZqNnAha/kiYfjkPhq7IVVUzdo/JJVszLpg+MqXmiilhb6aCpWaOUhicyFwFmMTmjupP7FCoZkHTzaR1WEvkXpG0cNbHa+LAdqcTCWx2MBpi8EzbwmVV1MxuWxMpWu+d9r+i5vct0b+F9idau8OtsuHMni0E+k8fJOtF4gbIbqYdYjfnzVwnXRSiLYbEPqOh2qDzNh7L6P2QqacI0ON2ue32cVhaOFaAdEat5NoHh9Fc4DHuNEtZcifWeVvCaUrM3H1p8NJmWdtYDcBYnNu1kkhlz4JSvk+IrGXkieFb5V2S0xIW9ylw6PeDAtbZnqOFr4gyZAWmynsmBBIWty7KmsGys2tAVKCRx5vl5Mmm9FVgcoawbKxZTARNYUrKqOWzrAjhABUi5MQSV5CleQM+R5r2qfUJbTBKWwOUVq5l5PktRlHZHTBIWmw2VhmwWai309HJ83XnGqRRZZ2aa0CQtHhsAxo2CIKJC7oKqqOByb6UfbTLfi4Ylu9M646iIP6+i+YioBwvtYomLr5T2wyv+Frc/DfLmnp1b6H8ljlhtM6fjz04lc6qCYAJPRepVLwQ0k8C8dZOyrwS+w7rOYsXeZ39E3TeGiBzaAitFyYZ2Ja13dkeLTA9lpstzwFhDgbdLkeI6+IWJqP1d1sX3PWPFWGGYWgd7bjlYTfkpR9GkGOL3SXQOOEpWzLTUHe6giLkKofipBLQYBEjaPLwPy9UanoD2vdcfrax9R7LDyaqizrtt4m4Hmo4NxABLZBIAP/NtPqmaoFUamEFzD6mBt9FUHFFpcBcOE+Tt7dOPfwTcaEnaovsTg2RJEHr9+arKmh0gWNxHWP7I2Z4mcPrHRpEf4ov81PEUA6g17ANQbPjMEH6fRNxvhCddB0qUeO9+Pu4QxS58yl8jxZqhrTzE+QJMev6K8+HLo4H36peLVjlKnRWNoE3Ntv3VjlbdBB+YTNTDt02EkfcBdwTgLED0T80yfVo1OBDXAbEqx+CIWWoVtJkGy0uBxIeF3Yp3pnJkj9ki3oksW9wCt2U12rhgVszFmPdmLwdinWZiYVrVyoHhRGVjooUWKhLC40u4T2pyYw+XBqbFEKkmMrZcvKz+GOi4ihnhTaFwtCFScSu1CroRGoQoNcOii8rmoKR0HNQLJ/8A6Dlb8Rhj8MS9h1BvVtw4Dxi/or2tWtZIjEmVlOaqjbHBp2fEaFUlhgwBvZAqYu4a0Ena0yPDwWr7Y5UKGKL2gCnV/EOAT/MB5rM4WgWVrWHv9hZxn+zokr2h7CUzTaCSST/U028rLr6xN/29ipVX63bwPC6PRA6OPWHR/pIK557ZcdILgnXBPNut+niOIUcbUbaLAEGOhmSPXcdfoWhUYTBlpGzgQQehsLQq3PsC5vfsQeW2B9PZJR0V62XFVxw//EU5dTd+NvIPBHukcxrjV8RkaHjV5AiZB8CPSbK0yLFtdhw11yRBbuD9z9wq5+G0jSO/SAMDpcm3lcQqcdERlt2Ew+M1UCzcAx43/Qz7rQZLU/3QDokCDxPE+X6rKYNgY59Mix28ImI+kdIVg/Flu9gRFtiTv+Xuha2Et6JPo/BxDY/C5wA/T6q9xuMpUZqVHtAdtPT9FmszxMUzVfswavEkAiB5lZfH0ajqlCriX6jXnSwEEUmkTT1DguvbwHktMcLTMsk+WbpvbXDOlrTPHM3XHZm+paiD4mIHkAsfi8K2maVWm0atQbG2oHefLefBfSXtDKTXwASBb6KJRtWmVGSX0VuAxtRpOsGBaTaTzHULX9mcya4iObHrKyjsWH6mxYCzj18FzKHOp1AQZEiUsb8tUE16Ts+tNqBSD0hhak3TOuF6BxDC8RCC2uF59ZAUefWQzXQ3OQyUWOhn4q4lda8ixBgVyeq8DCTxeI4CmUkkVGLZLEYkBKisTfhKPd1K8aq5nNyOlQSQw+v0UqFDVcoVGE5hevsqihSdGX7d4MVA0WkL5zisEGme8TtvEr6h2jZrPvKxOY0wTDYgfVYz09GmN6plRh6RjnyNvZPUGWvvFuSR98orqZDdhPCSOO0Tqj79FK6W+DNTAg72vzY+s7ogwwDSyzmnjaPLn74WfzTtATDKTe86zZ2HU+VlWZhgKoptq1aztJqNpgB0EuO+kTMAXJ9FvDHZjPJXTU4DDPpS2Zabg9P0P6Iznlpg2vtt9zCyz8VVwRD21HVKcw5jzPq07grY0MTTxdH4lPeJ8RG4KPGrQlO3sC6hMERY+H2d/mjVsPqE82/LdTwVEkeYhO4KmCIPCxo0so+3eHIy7U3hzCfLV/ZZTA5zQcwNqmCI38Lgr6Lm1NrqFSmbtdx0gj3FlnezmQYeXOqS6+0mIB/CRMLX1Bx8szUJX6Qnk9GrjK9P4TIoUiXOe7Ykgi3oVqO0GatMNYZDbA8SOijmOaN0fCpjSz+ltv2WfrnVYNJPUnjyWUpL+lG0IVtlllup5iYFlocvpDURNgfdZ3DN+EA55l3DWq5wGOuB1959E4JJ7M8jb4fScM8Bg8guPrJei7ujyC5eV3nJQ215UxKVp1E22oECI3XHFSL1EwkB5eXZXUDI42oJgFU2OxBCNjqvuq3EVDBXFknbOzHGkI4rMiNt+iby/U8S6wVZRoh7rq9c4BoaFONN7Zc3XA1Gj3oBsnjYgJbB90STwl6mJcSDxK6EYMVz10D3WFxOrV6rb553qU+N1hscS0yNvdZZFsvGxTOseQNI+/ZV+Hy/X3qjjf0A+Vl14LqgN/WY8vFN42mYDm+oUUa39Cea5IRpq0t2Sbc26KpqYmlUHfOg2Ja6xkXEdVdMzRzLTY/fRRfVovMvotJ6iy0U9bM3jMpnWYCoBTZ3oO4+g6q47IYx+HfpeCGuBDt7O4lXmHxGHYf93Qa0nm3uSUHOCH95oib+oVPIlHyhRxbtmho4sD1+/vyT9GsJkc+Xn6rE0sU9unpYz48DzV9gcdLQfv1WSbNHAdzURLt5tCrMqaehubiNjyDCZxeZMDCXbQd/DY+CV7PYwPJ+G7UNyWkWJOx6GFEoO7KjJKI3isE0d6I3uq2lhSXzEjgn9FqcPidTyNIfsNIFx4mSnG5WR3oY0me4DeOs7KoY22ZzyUjMuw5Gw/zGwnzNk5lGEHxGkum4/CIH/Ub/ACQ8YRruWTt3nPcf9AWg7JYQOfq7pA6B/wD5FbqG6Of06NhRZAH916oEV7gFEPBXSY2Ca1TC6UE1ggYRxXpQdUqRSAJPivIN15AxasCSSqfNXd03urjH1w2yz2bYjukkLhmlR1xbFsqoO1bq4o0yX3mAqTIqpJJC0lA6RPVGPhU+jzC0DxKqMzxDRzHyXsfmmg2v6KjrOfVMnV9AtvX0Y19ljQrB9N7RfkclYfHl5dEx6BavB1HNcAIjm3HiVX59Rax2oCxvKUo6scJU6M3Ua5onUisoOcAZj6Jp9Zjm8BLOrgCAY8VPkr0BxGAefxRHUb/RJPwp3DTb+aSPkrSlU/xk+SZoYBrzNz58J/jvgfkrpSUaJLhY9b2t6q0bhdY+7bJyrgm0/X72U/4dzw0Bj4m/8g9eYUOD4WsiYhicGNIAAMbT9FRHH/Blr2vaPIuPpFostT8EtJBqSfAWA3jzT1OmHC7JHV1k4xB5KPnea1Q9msOLrFzQ4mPOOt1t+z2Utw2GbPeqP7zo/FJG0dAqzMskoiq14JLdUlnHWx6SBZXhxxkEWHAF/eVrWqInK6oZpF7Tu2iDO0F5PUyEbD4ukCZqF0eAcD5zsqg4m9gJvcmTfdOsqP0EgNd1DQAdPlBDh5goSoykz1J7nu7tOxO7RTA9S1p+q2+V0xTYABfnlZjs9RYagdYHgju+7bj2I8lriCPFa497M5En1Z6fRc+JCgUJxVkhy8lCay64xymgBzDwN1Oq4cJHWoGoQkA7IXkp8UriBlXVqa3bpfG4PWLlDoVhqJUMdmQAXBarZ2bvQbLcI1lm8p/EXIEwlcqxragkDblGxtWC2AtI1RLuydTDCD16qmxYFMfiJ+isqte/osr2gqOm+yqTpaJSt0yOKzEzAMDw3P7JzDOFamWv346/NZL+LGrhPYTMCHAiTHJ29lUXfRSVcBYzB6HEcIdPBNJk381fam1hbflJ1aDW7TPhv/8AP1S80P0AZhQNgB6beJ6esJvCvANiXeVh77n0jzShBiD3W+HPkOUxh5PEN6dR1cd9P2Oo0i0ZyTLalUkSACfDafzPjdAxDnG9R8NOzG7z1JifZA+NNmn12H7AXRQ8CDYniem5cfTj91clZC0ep1A1sNGmP5n8+nKBiMXNy60bmw8YCFiNRMk3MemxMe6EzLpMud6H1UUy7QriS6oIaDp8Od4RaWWmPxERwePCVZsa0AdEvicU37+SbpIPQth8LouTPmZTNGt3tQNwknVCRuo03kLCUilGzU5ZidTw5tncjr4j7/faU32BXzvIXzUC+hMMgLXC7tkZFTo85wKFUC6G3RqgWxmLspo7GLlKndPFgSASdSRWUQmDTCFUQMjbqvKOkryAPn2ZYw05AuqWnXrV3hrGiJuStVmWXgyiZNgmUxHK85J3R3+klY/gcOKVMBJ5lX2vH1T2aviByqqow6hK1f6Mr+yYcW9TPJVFnztdyVcZi60yqKvTLib+6G/oUV9mUrMOqxsm6TdIlxgfM+CLimhjrXPXgenPr7JKs1z7ztu47D76BNaKey1oY+I0d0fM/fv48KyZWES6x/p/9v0Wbw1YNMN/6jufIfyj5/RWeGvc7D5np+v7hbJpmMlRZhswTcnYceZ8PBQxBkEA83P9RH5DhCBIkk3Nv7eVvl0Q6dRwvzMN8+vkN/OE2ibG6dHTbc8zyd9J8BufHylRdPedP+EepvPpPuln4hwFvIfr6390Ok95bf8Aqb+aBDOMfBPhb2SD8W42CI6k4kyZuT7lTp4RJgKNfU21G+/yU6eHJ3N1Ysw4UzQUtNlJiFVsBKMN907iQdikgyHLCRvA1HZyn3gt4whYnsw0zK1LKpXRgX8Tnyu5FnTC49KsrFdY4k3WxA7TAU5hAeA3ZRNRABfjXuVP4wSMaipVLBADnxWryrPjLyBFRVqDUQu5YzU89AhtpkSSo4KsWzPK4uM6/oPjasv6oFZ4Km2mZJKUwzS55JFhsn9iJYhwLYG/VZHG1XNcQCb+pWpzGsB0+/JZXNyXTG3hz5okOAm9zeTPgPzKEL34Gw4CVY7TI5Kj/ERYoKoNo71vfgDcnyCfw1fYjbZo5/5j4/fCTpGW7xq99ANz6kf6fFSoVdTu7sPyVJ0S1ZcNMkNHFvM8/NMaQfQQPzPrf3CqsFV0knoD7mw+s+ia+MQB6k/ktVIycQppyjUWbjyPz/dQoPlFpm6ExNB3Ue8fNTbTCiX8qFfERdXoighahV/BBdX9kM1eZWcmWkL1H9UNg1ERdTq1A4p/KcHLgAud7dGy0jU9m8JpZe0q3qho2QcHROyJiKOnmV2RjSo5W7dnNZleqEoVPEAIzXTdFARfVKLTdKUfJdCYYIsmwJ0XEGy6+oTZdbU0hKit3kxBvhry78QryQFbjDLoCCzDy9o45QK2IIJi5PKLh3u1AlcraZ1JMax5EwEhiO6ALmei5mON0EncpGqX1GgzCbYqIZm60Qs9VrydKtMdO02VNimAXUFpaK/F072SOmTHJIA8yrL4lroYpi7toBjzNvzn0TRViuMfEgbWH+UWH6o2Bqwl6wjxQgw2hAF6xw0z1d/2i3/cfZFpmSfBVTMTEDo0fO/5pinioVNkeWW1Mphu0SqpmKsi06rnITE0Wja9hPiD5/f1Qa7hO9lAM6nf7lCqUCeU3JkqKBVcRBj780NoLjBRX0YIKJqAUO2XpEzTaLcrSdksPL/JZmncrcdjWQSYRBXJESei+dhiLpeswndXD2SlKlE8LsMCudSEIdAwnX4Z3RC+AUAcom+ynWcCVL4JCgGmUAde2yXDBKZeDyoVWRskBOR4LyW0leRYiipMLjtsjg7eCawLmgOjlccwBsrkjE62zOZ3qc4RsF4Y6AAT6JnOTDVnXGdkcGtoZzGoSJGyqdXW6sqJBBG/ifyVfiCAYCKGhWqyfNCc07eP0/uiuepEIARqzeynRcE4ylKG/BCUws5pEm3h7WRaVMc9VxuG5BRmUzEFArJOogC3K5Slv0XeFINRRNhm1CQJUm1uqWqnhSaeqBBn1JQm+K49wIsiNakwDYTdb3szDW+aw2BpSVssBU0wFWPpMzaU7hEfTACrsHibBPGsHBdRjRA3XKlMHZRbK7TqXQBw0lz+Fi6O+oEvUxBjdMANaClnhGbJXKlEhIAWlq8uaF1AGfoOiQvVa/dPgvNpHaUviKdi1cmzpKZj/jOIcbBI4zARsbIxim4xdDOMLrGyRf8AorKlfT3R7oQeOU1iqF0pVww4QgBvcOi8XACeVylRMzwEd1GQqolsUALbjlTa6bFEdShCbUBdHROhWHwrYm+yl8S+9kAVAJXmd9symIZdVC6wwLpZzBIvx81OuII8B9UgOipKm4Sl8OOvCbH9SQWepthGbUSdSoSmaDJSYizywElXjahkKqwQgSmaFXvIXAZu8n7zbqwpMDSqnIX2VwRBuuuPDB9O1RNghfA08o3xAFF7pTEAcvMaIXiFFjboAMxsBDfXGyM4wlNOopDJ2XF34JXkAf/Z"],
            ["b'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",
            "b'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"]]
        this.processImages(pairs);
    }

    componentDidMount(){
        this.props.setRedirect(false);
    }

    processImages=(imagePairs)=>{
        let modifiedPairs=[];
        for (let pair of imagePairs){
            let modifiedPair = [];
            for (let image of pair){
                let cut = image.substring(2);
                let img64 = "data:image/jpg;base64," + cut
                modifiedPair.push(img64)
            }
            modifiedPairs.push(modifiedPair);
        }
        console.log(modifiedPairs);
        this.props.updateImagePairs(modifiedPairs);
    }

    retrieveData=()=>{
        this.setState({ loading: true }, () => {
            setTimeout(() => {
                this.setState({ loading: false });
                this.props.gotData(true);
            }, 1000);
        });
        // axios.get('http://127.0.0.1:5000/'+this.props.uuid)
        //     .then(response=>{
        //         if (response.uuid===this.props.uuid){
        //             this.processImages(response.img_pair);
        //             this.updateImageSizes(response.img_size);
        //             this.updateProcessingTime(response.processed_time);
        //             this.updateImageNames(response.file_name);
        //             this.setState({loading:false},()=>{
        //                 this.props.gotData(true);
        //             });
        //         }
        //     })
        //     .catch(err=>{
        //         alert("Error:"+err)
        //     })
    }

    downloadClick = (img64, name) => {
        FileSaver.saveAs(img64, name);
    }

    render() {
        let content = (
            <h2>Upload files from the "Input" page to begin</h2>
        )
        if (this.props.sentStatus&&this.state.loading){
            content=(
                <Fragment>
                    <h2>Getting your data...</h2>
                    <h3>Please do not navigate to another page</h3>
                    <Loader />
                </Fragment>
            );
        }
        else if (this.props.sentStatus && !this.state.loading && this.props.hasData){
            content=null;
        }
        if (this.props.resetRedirect){
            content=<Redirect to="/" />
        }
        return (
            <div>
                {this.props.sentStatus 
                    && !this.state.loading 
                    ? <button onClick={this.retrieveData}>Refresh Results</button> : null}
                {content}
                {this.props.sentStatus
                    &&!this.state.loading 
                    ? <Results download={this.downloadClick}/> : null}
            </div>
        );
    }
}

const mapStatetoProps=reduxState=>{
    return{
        uuid:reduxState.userInfo.uuid,
        sentStatus:reduxState.userInfo.sent,
        resetRedirect: reduxState.userInfo.resetRedirect,
        hasData:reduxState.userInfo.gotData,
    }
}

const mapDispatchtoProps=dispatch=>{
    return{
        setRedirect:(bool)=>dispatch(actionCreators.setRedirect(bool)),
        gotData:(bool)=>dispatch(actionCreators.gotData(bool)),
        updateImagePairs:(pairs)=>dispatch(actionCreator.updateImagePairs(pairs)),
        updateImageSizes:(sizes)=>dispatch(actionCreator.updateImageSizes(sizes)),
        updateProcessingTime:(time)=>dispatch(actionCreator.updateProcessingTime(time)),
        updateImageNames:(types)=>dispatch(actionCreator.updateImageNames(types))
    }
}

export default connect(mapStatetoProps,mapDispatchtoProps)(Output);