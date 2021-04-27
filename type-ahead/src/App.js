import './App.css';
import React from 'react';
import axios from './modules/axios'


class App extends React.Component{
  constructor(props) {
    super(props);
    this.state = {showInputTip: true, query: ''};
    this.onInput = this.onInput.bind(this);
  }

  onInput(event) {
    const query = event.target.value.trim().toLowerCase(); // 输入
    if (query.length < 1) {
      // 未输入字符，显示提示，不显示数据列表
      this.setState({ showInputTip: true, query: ''})
    } else {
       this.setState({ showInputTip: false, query: query })
    }
  }

  render() {
    return (
      <form className="search-form">
        <input type="text" className="search" placeholder="City or State" onChange={this.onInput}/>
        <ul className="suggestions">
          <li className={this.state.showInputTip ? '' : 'hideEle'}>根据输入筛选数据</li>
          <li className={this.state.showInputTip ? '' : 'hideEle'}>
            <span className="name">&#123;&#123; 城市, 州 &#125;&#125;</span>
            <span className="population">&#123;&#123; 人口 &#125;&#125;</span>
          </li>
          <ListItems query={this.state.query} />
        </ul>
      </form>
    );
  }
}

class ListItems extends React.Component {
  constructor(props) {
    super(props);
    this.state = {data: []};
  }

  componentDidMount() {
    axios.get('https://gist.githubusercontent.com/Miserlou/c5cd8364bf9b2420bb29/raw/2bf258763cdddd704f8ffd3ea9a3e81d25e2c6f6/cities.json')
      .then(response => {
        this.setState({data: response.data});
      })
      .catch(error => {
        console.log(error)
      })
  }

  render() {
    const queryStr = this.props.query.trim().toLowerCase();
    if(queryStr.length < 1) return ''
    return this.state.data.map((item, index) => {
      const str = (item.city + ',' + item.state).toLowerCase();
      let heighLightIndexs = [];
      // 获取匹配字符的位置
      for (let i = 0, index = 0; i < str.length && index < queryStr.length;) {
        const pos = str.indexOf(queryStr.charAt(index), i);
        index++;
        if (pos < 0 && index <= queryStr.length) {
          heighLightIndexs = [];
          break
        }
        i = pos;
        heighLightIndexs.push(pos);
      }

      // 无匹配字符串
      if (heighLightIndexs.length < 1) return ''
      
      return (
        <LiItem data={item} heighLightIndexs={heighLightIndexs} key={index}>
          {item.city},{item.state}
        </LiItem>
      )    
    });
  }
}

function LiItem(props) {    
  const str = (props.data.city + ',' + props.data.state).toLowerCase().toLowerCase();

  // 获取字符节span
  const charSpans = str.split('').map((item, index) =>{
    return (
      <span key={index} className={props.heighLightIndexs.includes(index) ? 'heighLight' : ''}>
      {item}
      </span>
    )
  });
  return (
    <li><div>{charSpans}</div><div>{props.data.population}</div></li>
  );
}

export default App;
