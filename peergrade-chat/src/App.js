import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import moment from 'moment';

class App extends Component {


    state: {
        messages: any,
        newMessage: string,
        loading: boolean,
        error: string,
    };

    toUser: number;
    fromUser: number;

    Api: any;

    constructor(props) {
        super(props);

        this.state = {
            messages: null,
            newMessage: '',
            loading: false,
            error: null,
        }

        //change these two variables to shift between sender and receiver
        this.toUser = 2;
        this.fromUser = 1;

        //creating an API Axios instance
        this.Api = axios.create({
            baseURL: 'http://localhost:1337/',
            timeout: 1000,
        });
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount(){

        //fetch all chat between fromUser and toUser. loading state will help to show loading... text if data is being fetched
        this.setState( { loading: true }, () => {
            this.fetchAPI(this.toUser);
        });


    }

    //Fecth API calling
    fetchAPI = (id) => {

        var self = this;
        this.Api.get('chat/'+this.toUser)
            .then(function (response) {
                self.setState({ messages: response.data.data, loading: false });
            })
            .catch(function (error) {
                self.setState({ loading: false, error: 'Something went wrong'});
            });
    }

    //render chat widget
    renderChat(messages) {
        if(messages) {
           return messages.map((message, index) => {
               let className = message.fromUser.id = this.fromUser ? 'right': 'left';
                return (
                    <li className={'item ' + className}  key={index}>
                        <p><b>{message.fromUser.name}:</b> {message.message}</p>
                        <p className='time'>{moment(new Date(message.createdAt)).fromNow()}</p>
                    </li>
                )
            })
        }

    }

    //handle change event of input
    handleChange(event) {
        this.setState({newMessage: event.target.value});
    }

    //handle form submit event
    handleSubmit(event) {
        this.sendMessage();
        this.nameInput.focus();
        event.preventDefault();
    }

    //send message to the server
    sendMessage () {
        var self = this;
        this.Api.post('chat/send', { fromUser: self.fromUser, toUser: self.toUser, message: self.state.newMessage})
            .then(function (response) {
                self.setState({ messages: response.data.data, loading: false, newMessage: '' });
            })
            .catch(function (error) {
                self.setState({ loading: false, error: 'Something went wrong'});
            });
    }

    //render component
  render() {
    const { loading, messages, error } = this.state;

    let content = null;

    if(!loading){
        if(messages && messages.length){
            content= this.renderChat(messages);
        }else{
            content = <p>Start a conversation</p>
        }

    }else{
        if(error){
            content = <h3>{error}</h3>
        }
        else{
            content = <h3>Loading...</h3>
        }

    }
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Peergrade Chat UI Technical Test</h1>
        </header>
        <ul className="Chat-List">
            {content}
        </ul>
          <div className='Chat-List'>
              <form onSubmit={this.handleSubmit}>
              <input ref={(input) => { this.nameInput = input; }} type='text' required placeholder='Enter message' value={this.state.newMessage} autoFocus onChange={this.handleChange} className='textbox'></input>
              <input type="button" value="Send" onClick={this.handleSubmit} className='button'/>
              </form>
          </div>
      </div>
    );
  }
}

export default App;
