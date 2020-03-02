import { h, Component } from 'preact'

// 待用hooks重构
class LazyRenderBox extends Component {
  componentWillUpdate(nextProps) {
    return !!nextProps.hiddenClassName || !!nextProps.visible
  }

  render() {
    let { className } = this.props
    const { children } = this.props
    console.log('this.props.hiddenClassName', this.props.hiddenClassName)
    console.log('visible', this.props.visible)
    if (!!this.props.hiddenClassName && !this.props.visible) {
      className += ` ${this.props.hiddenClassName}`
    }
    const props = { ...this.props }
    delete props.hiddenClassName
    delete props.visible
    if (props.class) delete props.class
    props.className = className
    return <div {...props}>{children}</div>
  }
}

export default LazyRenderBox
