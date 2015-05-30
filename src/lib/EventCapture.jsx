'use strict';
var React = require('react');
var Utils = require('./utils/utils.js')

var EventCapture = React.createClass({
	propTypes: {
		mainChart: React.PropTypes.number.isRequired,
		mouseMove: React.PropTypes.bool.isRequired,
		zoom: React.PropTypes.bool.isRequired,
		zoomMultiplier: React.PropTypes.number.isRequired,
		pan: React.PropTypes.bool.isRequired,
		panSpeedMultiplier: React.PropTypes.number.isRequired,
		defaultFocus: React.PropTypes.bool.isRequired,
	},
	getInitialState() {
		return {
			dragOrigin: [0, 0],
			defaultFocus: false
		};
	},
	contextTypes: {
		_width: React.PropTypes.number.isRequired,
		_height: React.PropTypes.number.isRequired,
		// _eventStore: React.PropTypes.object.isRequired,
		// _zoomEventStore: React.PropTypes.object,
		_chartData: React.PropTypes.array,
		onMouseMove: React.PropTypes.func,
		onMouseEnter: React.PropTypes.func,
		onMouseLeave: React.PropTypes.func,
		onZoom: React.PropTypes.func,
		onPanStart: React.PropTypes.func,
		onPan: React.PropTypes.func,
		onPanEnd: React.PropTypes.func,
		panInProgress: React.PropTypes.bool,
	},
	componentWillMount() {
		this.setState({
			className: this.props.className,
			inFocus: this.props.defaultFocus
		});
	},
	getDefaultProps() {
		return {
			namespace: "ReStock.EventCapture"
			, mouseMove: false
			, zoom: false
			, zoomMultiplier: 1
			, pan: false
			, panSpeedMultiplier: 1
			, className: "crosshair"
			, defaultFocus: false
		}
	},
	componentWillReceiveProps(nextProps, nextContext) {
		console.log('hererasdfdsfs');
	},
	toggleFocus() {
		this.setFocus(!this.state.defaultFocus);
	},
	setFocus(focus) {
		this.setState({
			defaultFocus: focus
		});
	},
	handleEnter() {
		if (this.context.onMouseEnter) {
			this.context.onMouseEnter();
		}
	},
	handleLeave() {
		if (this.context.onMouseLeave) {
			this.context.onMouseLeave();
		}
		/*if (this.context._eventStore) {
			// console.log('out');
			var eventData = this.context._eventStore.get();
			this.context._eventStore.get().mouseOver.set({'value': false});
			this.context._eventStore.get().set({ pan: false });
			this.setState({
				dragging: false,
				dragOrigin: [0, 0],
				className: this.props.className
			})
		}*/
	},
	handleWheel(e) {
		if (this.props.zoom
				&& this.context.onZoom
				&& this.state.inFocus) {
			e.stopPropagation();
			e.preventDefault();
			var zoomDir = e.deltaY > 0 ? this.props.zoomMultiplier : -this.props.zoomMultiplier;
			this.context.onZoom(zoomDir);
		}
	},
	handleMouseMove(e) {
		if (this.context.onMouseMove && this.props.mouseMove) {
			var newPos = Utils.mousePosition(e);
			if (this.context.panInProgress) {
				if (this.props.pan && this.context.onPan) this.context.onPan(newPos);
			} else {
				this.context.onMouseMove(newPos);
			}
		}
	},
	handleMouseDown(e) {
		var inFocus = true
		var chartData = this.context._chartData.filter((each) => each.id === this.props.mainChart) [0];
		if (this.props.pan && this.context.onPanStart) {
			this.context.onPanStart(chartData.scales.xScale.domain())
		}
		this.setState({
			inFocus: inFocus
		});
		e.preventDefault();
	},
	handleMouseUp(e) {
		if (this.props.pan && this.context.onPanEnd) {
			this.context.onPanEnd();
		}
		e.preventDefault();
	},
	render() {
		var className = this.context.panInProgress ? 'grabbing' : 'crosshair';
		console.log(this.context.panInProgress, className);
		return (
			<rect 
				className={className}
				width={this.context._width} height={this.context._height} style={{opacity: 0}}
				onMouseEnter={this.handleEnter}
				onMouseLeave={this.handleLeave}
				onMouseMove={this.handleMouseMove}
				onMouseDown={this.handleMouseDown}
				onMouseUp={this.handleMouseUp}
				onWheel={this.handleWheel}
				/>
		);
	}
});

module.exports = EventCapture;