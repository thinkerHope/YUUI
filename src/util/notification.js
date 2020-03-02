import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import Animate from 'rc-animate'

class Notification extends Component {
    constructor() {

    }
    
}

Notification.newInstance = function getNewInstance(properties, callback) {

    const { getContainer, ...props } = properties || {}
    let div = document.createElement('div')
    if (typeof getContainer === 'function') {
        const root = getContainer()
        root.appendChild(div)
    } else {
        document.body.appendChild(div)
    }
    // 获取 Notification 实例
    function ref(notification) {
        console.log('notification', notification)
        callback({
            notice: function(noticeProps) {
                notification.add(noticeProps)
            },
            removeNotice: function(key) {
                notification.remove(key)
            },
            component: notification,
            destory: function() {
                ReactDOM.unmountComponentAtNode(div)
                div.parentNode.removeChild(div)
            },
        })
    }

    ReactDOM.render(<Notification {...props} ref={ref} />, div)
}