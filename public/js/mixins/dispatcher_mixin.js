module.exports = {
  propTypes: {
    dispatcher: React.PropTypes.object
  },

  childContextTypes: {
    dispatcher: React.PropTypes.object
  },

  getChildContext: function() {
    return {
      dispatcher: this.props.dispatcher
    };
  },

  contextTypes: {
    dispatcher: React.PropTypes.object
  },

  componentWillMount: function() {
    if (this.props.dispatcher) {
      this.dispatcher = this.props.dispatcher;
    } else {
      this.dispatcher = this.context.dispatcher;
    }
  }
};
