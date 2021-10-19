"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
var react_1 = require("react");
var styles_1 = require("@material-ui/core/styles");
var Checkbox_1 = require("@material-ui/core/Checkbox");
var types_1 = require("../types");
var core_1 = require("@material-ui/core");
var ITEM_HEIGHT = 48;
var ITEM_PADDING_TOP = 8;
var MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250
        }
    },
    getContentAnchorEl: null,
    anchorOrigin: {
        vertical: 'bottom',
        horizontal: 'center'
    },
    transformOrigin: {
        vertical: 'top',
        horizontal: 'center'
    },
    variant: 'menu'
};
var useStyles = styles_1.makeStyles(function (theme) { return ({
    formControl: {
        margin: theme.spacing(1),
        width: 300
    },
    indeterminateColor: {
        color: '#f50057'
    },
    selectAllText: {
        fontWeight: 500
    },
    selectedAll: {
        backgroundColor: 'rgba(0, 0, 0, 0.08)',
        '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.08)'
        }
    },
    root: {
        '& .MuiSelect-selectMenu': {
            whiteSpace: 'initial !important'
        },
        '& .MuiInputBase-root ': {
            width: '100%'
        }
    },
    menuPaper: {
        maxHeight: 'initial !important'
    }
}); });
var options = Object.keys(types_1.YTCategories).filter(function (key) { return !isNaN(Number(types_1.YTCategories[key])); });
var values = options.map(function (option) { return types_1.YTCategories[option]; });
var SelectYTCat = function (_a) {
    var setMatcherValue = _a.setMatcherValue;
    var classes = useStyles();
    var _b = react_1.useState([]), selected = _b[0], setSelected = _b[1];
    var isAllSelected = options.length > 0 && selected.length === options.length;
    var handleChange = function (event) {
        var value = event.target.value;
        if (value[value.length - 1] === 'all') {
            setSelected(selected.length ===
                Object.keys(types_1.YTCategories).filter(function (key) { return !isNaN(Number(types_1.YTCategories[key])); }).length
                ? []
                : options.map(function (o) { return types_1.YTCategories[o]; }));
            return;
        }
        setSelected(value);
        setMatcherValue(value);
    };
    var handleCheckboxChange = function (e, value) {
        var newSelected;
        if (e.target.checked) {
            if (selected.includes(value))
                return;
            newSelected = __spreadArrays(selected, [value]);
        }
        else {
            newSelected = __spreadArrays(selected.filter(function (v) { return v !== value; }));
        }
        setSelected(newSelected);
        setMatcherValue(newSelected);
    };
    var toggleSelectAll = function () {
        if (isAllSelected) {
            setSelected([]);
            setMatcherValue([]);
        }
        else {
            setSelected(values);
            setMatcherValue(values);
        }
    };
    return (react_1["default"].createElement("div", { className: classes.root },
        react_1["default"].createElement(core_1.FormControlLabel, { control: react_1["default"].createElement(Checkbox_1["default"], { classes: { indeterminate: classes.indeterminateColor }, checked: isAllSelected, indeterminate: selected.length > 0 &&
                    selected.length <
                        Object.keys(types_1.YTCategories).filter(function (key) { return !isNaN(Number(types_1.YTCategories[key])); }).length, onChange: toggleSelectAll }), label: 'Select all' }),
        Object.keys(types_1.YTCategories)
            .filter(function (key) { return !isNaN(Number(types_1.YTCategories[key])); })
            .map(function (option) { return (react_1["default"].createElement(core_1.FormControlLabel, { key: types_1.YTCategories[option], control: react_1["default"].createElement(Checkbox_1["default"], { checked: selected.indexOf(types_1.YTCategories[option]) > -1, onChange: function (e) { return handleCheckboxChange(e, types_1.YTCategories[option]); } }), label: option })); })));
};
exports["default"] = SelectYTCat;
/**
 *
 <div className={classes.root}>
      <InputLabel id='mutiple-select-label'>Multiple Select</InputLabel>
      <Select
        labelId='mutiple-select-label'
        multiple
        value={selected}
        onChange={handleChange}
        renderValue={s => {
          console.log('render label ')
          return (s as string[]).length
            ? (s as string[])
                .map(value => options.find(o => YTCategories[o] === value))
                .join(', ')
            : 'Select youtube categories'
        }}
        placeholder={'Select youtube categories'}
        MenuProps={{ ...MenuProps, classes: { paper: classes.menuPaper } }}
      >
      <MenuItem
        value='all'
        classes={{
          root: isAllSelected ? classes.selectedAll : '',
        }}
      >
        <ListItemIcon>
          <Checkbox
            classes={{ indeterminate: classes.indeterminateColor }}
            checked={isAllSelected}
            indeterminate={
              selected.length > 0 &&
              selected.length <
                Object.keys(YTCategories).filter(
                  key => !isNaN(Number(YTCategories[key]))
                ).length
            }
          />
        </ListItemIcon>
        <ListItemText
          classes={{ primary: classes.selectAllText }}
          primary='Select All'
        />
      </MenuItem>
      {Object.keys(YTCategories)
        .filter(key => !isNaN(Number(YTCategories[key])))
        .map(option => (
          <MenuItem key={YTCategories[option]} value={YTCategories[option]}>
            <ListItemIcon>
              <Checkbox
                checked={selected.indexOf(YTCategories[option]) > -1}
                onChange={e => handleCheckboxChange(e, YTCategories[option])}
              />
            </ListItemIcon>
            <ListItemText primary={option} />
          </MenuItem>
        ))}
      </Select>
    </div>
 */
