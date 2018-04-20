"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.serialize = serialize;
exports.deserialize = deserialize;

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function serialize(element) {
  var replacer = function replacer(key, value) {
    switch (key) {
      case "_owner":
      case "_store":
      case "ref":
        return;

      default:
        return value;
    }
  };

  return JSON.stringify(element, replacer);
}

function deserialize(data, opt) {
  if (typeof data === "string") {
    data = JSON.parse(data);
  }

  if (_typeof(data) === "object") {
    return deserializeElement(data, opt);
  }

  throw new Error("Deserialization error");
}

function deserializeElement(element) {
  var opt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var key = arguments.length > 2 ? arguments[2] : undefined;
  var _opt$components = opt.components,
      components = _opt$components === void 0 ? {} : _opt$components,
      reviver = opt.reviver;

  if (_typeof(element) !== "object") {
    return element;
  }

  if (element === null) {
    return element;
  }

  if (element instanceof Array) {
    return element.map(function (el, i) {
      return deserializeElement(el, opt, i);
    });
  } // Now element has following shape { type: string, props: object }


  var type = element.type,
      props = element.props;

  if (typeof type !== "string") {
    throw new Error("Element type must be string");
  }

  type = components[type] || type.toLowerCase();

  if (props.children) {
    props.children = deserializeElement(props.children, opt);
  }

  if (reviver) {
    ;

    var _reviver = reviver(type, props, key, components);

    type = _reviver.type;
    props = _reviver.props;
    key = _reviver.key;
    components = _reviver.components;
  }

  return _react.default.createElement(type, _objectSpread({}, props, {
    key: key
  }));
}