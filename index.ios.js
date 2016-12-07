'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Keyboard,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
type State = {
    keyboardUp: boolean,
}
export default class reactNativeTabsGradient extends Component {
  state: State = {};
  onSelect(el){
    if (el.props.onSelect) {
        el.props.onSelect(el);
    } else if (this.props.onSelect) {
        this.props.onSelect(el);
    }
  }
  componentWillMount(){
    if (Platform.OS==='android') {
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.keyboardWillShow);
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.keyboardWillHide);
    }
  }
  componentWillUnmount(){
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }
  keyboardWillShow = (e) => {
    this.setState({ keyboardUp: true });
  }
  keyboardWillHide = (e) => {
    this.setState({ keyboardUp: false });
  }
  render() {
    const self = this;
    let selected = this.props.selected
    if (!selected){
        React.Children.forEach(this.props.children.filter(c=>c), el=>{
            if (!selected || el.props.initial){
                selected = el.props.name || el.key;
            }
        });
    }
    return (
      <LinearGradient key="gradientWrap" start={[0.0, 0.25]} end={[0.5, 1.0]} locations={[0.25, 0.75]}
      colors={['rgba(108, 1, 4, 0.2)', 'rgba(108, 1, 4, 1)']}
      style={[styles.tabbarView, this.props.style, this.state.keyboardUp && styles.hidden]}>
          {React.Children.map(this.props.children.filter(c=>c),(el)=>
              <TouchableOpacity key={el.props.name+"touch"}
                 testID={el.props.testID}
                 style={[styles.iconView, this.props.iconStyle, (el.props.name || el.key) == selected ? this.props.selectedIconStyle || el.props.selectedIconStyle || {} : {} ]}
                 onPress={()=>!self.props.locked && self.onSelect(el)}
                 onLongPress={()=>self.onSelect(el)}
                 activeOpacity={el.props.pressOpacity}>
                   {selected == (el.props.name || el.key) ? React.cloneElement(el, {selected: true, style: [el.props.style, this.props.selectedStyle, el.props.selectedStyle]}) : el}
              </TouchableOpacity>
          )}
      </LinearGradient>
    );
  }
}

var styles = StyleSheet.create({
    tabbarView: {
        position:'absolute',
        bottom:0,
        right:0,
        left:0,
        height:50,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    iconView: {
        flex: 1,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        opacity:1,
        backgroundColor:'transparent'
    },
    hidden: {
        height: 0,
    },
});
