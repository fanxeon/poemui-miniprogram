var chartData = require('./chart-data');

var DEFAULT_PALETTE = ['blue', 'teal', 'violet'];

function stableKey(value, fallback, counts) {
  var raw = String(value === undefined || value === null || value === '' ? fallback : value);
  counts[raw] = (counts[raw] || 0) + 1;
  return counts[raw] > 1 ? raw + '-' + counts[raw] : raw;
}

function normalizeAreaItems(items, palette) {
  var source = Array.isArray(items) ? items : [];
  var fallbackPalette = chartData.normalizePalette(palette || DEFAULT_PALETTE);
  var pointKeyCounts = {};
  var seriesDefinitions = [];
  var seriesByKey = {};
  var points = source.map(function normalizePoint(rawPoint, pointIndex) {
    var point = rawPoint && typeof rawPoint === 'object' ? rawPoint : {};
    var key = stableKey(point.key, 'point-' + pointIndex, pointKeyCounts);
    var rawSegments = Array.isArray(point.segments) && point.segments.length
      ? point.segments
      : [{
        key: 'value',
        label: point.seriesLabel === undefined ? '数值' : point.seriesLabel,
        value: point.value,
        theme: point.theme
      }];
    var values = {};
    rawSegments.forEach(function normalizeSegment(rawSegment, segmentIndex) {
      var segment = rawSegment && typeof rawSegment === 'object' ? rawSegment : {};
      var seriesKey = String(segment.key === undefined || segment.key === null || segment.key === ''
        ? 'series-' + segmentIndex
        : segment.key);
      var existing = seriesByKey[seriesKey];
      if (!existing) {
        var seriesIndex = seriesDefinitions.length;
        existing = {
          key: seriesKey,
          label: String(segment.label === undefined || segment.label === null
            ? (rawSegments.length === 1 ? '数值' : '系列 ' + (seriesIndex + 1))
            : segment.label),
          theme: chartData.normalizeTheme(segment.theme, fallbackPalette[seriesIndex % fallbackPalette.length]),
          index: seriesIndex
        };
        seriesByKey[seriesKey] = existing;
        seriesDefinitions.push(existing);
      }
      values[seriesKey] = (values[seriesKey] || 0) + chartData.finiteNonNegative(segment.value);
    });
    return {
      key: key,
      label: String(point.label === undefined || point.label === null ? '项目 ' + (pointIndex + 1) : point.label),
      values: values
    };
  });

  var series = seriesDefinitions.map(function prepareSeries(definition) {
    var values = points.map(function valueAtPoint(point) {
      return chartData.finiteNonNegative(point.values[definition.key]);
    });
    return {
      key: definition.key,
      label: definition.label,
      theme: definition.theme,
      values: values,
      valueTexts: values.map(chartData.formatValue)
    };
  });

  return {
    points: points,
    series: series,
    legend: series.map(function toLegend(item) {
      return { key: item.key, label: item.label, theme: item.theme };
    })
  };
}

function scaleMaximum(data, explicitMax, stacked) {
  var requested = chartData.finiteNonNegative(explicitMax);
  if (requested > 0) return requested;
  var pointCount = data.points.length;
  var maximum = 0;
  for (var pointIndex = 0; pointIndex < pointCount; pointIndex += 1) {
    if (stacked) {
      var total = data.series.reduce(function sum(result, series) {
        return result + series.values[pointIndex];
      }, 0);
      maximum = Math.max(maximum, total);
    } else {
      data.series.forEach(function compare(series) {
        maximum = Math.max(maximum, series.values[pointIndex]);
      });
    }
  }
  return maximum || 1;
}

function clampCoordinate(value, minimum, maximum) {
  return Math.max(minimum, Math.min(maximum, value));
}

function curveCommands(points, curve) {
  if (!Array.isArray(points) || points.length < 2) return [];
  var mode = ['natural', 'linear', 'step'].indexOf(curve) > -1 ? curve : 'natural';
  var commands = [];
  for (var index = 0; index < points.length - 1; index += 1) {
    var current = points[index];
    var next = points[index + 1];
    if (mode === 'linear') {
      commands.push({ type: 'line', x: next.x, y: next.y });
      continue;
    }
    if (mode === 'step') {
      commands.push({ type: 'line', x: next.x, y: current.y });
      commands.push({ type: 'line', x: next.x, y: next.y });
      continue;
    }
    var previous = index > 0 ? points[index - 1] : current;
    var after = index + 2 < points.length ? points[index + 2] : next;
    var cp1x = current.x + (next.x - previous.x) / 6;
    var cp1y = current.y + (next.y - previous.y) / 6;
    var cp2x = next.x - (after.x - current.x) / 6;
    var cp2y = next.y - (after.y - current.y) / 6;
    var localMinY = Math.min(current.y, next.y);
    var localMaxY = Math.max(current.y, next.y);
    commands.push({
      type: 'bezier',
      cp1x: cp1x,
      cp1y: clampCoordinate(cp1y, localMinY, localMaxY),
      cp2x: cp2x,
      cp2y: clampCoordinate(cp2y, localMinY, localMaxY),
      x: next.x,
      y: next.y
    });
  }
  return commands;
}

function executeCommands(target, commands) {
  commands.forEach(function execute(command) {
    if (command.type === 'bezier') {
      target.bezierCurveTo(command.cp1x, command.cp1y, command.cp2x, command.cp2y, command.x, command.y);
    } else {
      target.lineTo(command.x, command.y);
    }
  });
}

function numberText(value) {
  return String(Math.round(value * 100) / 100);
}

function pathFor(points, curve) {
  if (!Array.isArray(points) || !points.length) return '';
  var path = 'M ' + numberText(points[0].x) + ' ' + numberText(points[0].y);
  curveCommands(points, curve).forEach(function append(command) {
    if (command.type === 'bezier') {
      path += ' C ' + [
        command.cp1x,
        command.cp1y,
        command.cp2x,
        command.cp2y,
        command.x,
        command.y
      ].map(numberText).join(' ');
    } else {
      path += ' L ' + numberText(command.x) + ' ' + numberText(command.y);
    }
  });
  return path;
}

function buildAreaGeometry(data, options) {
  var config = options || {};
  var width = Math.max(1, Number(config.width) || 300);
  var height = Math.max(1, Number(config.height) || 160);
  var padding = Object.assign({ top: 8, right: 8, bottom: 8, left: 8 }, config.padding || {});
  var plotWidth = Math.max(1, width - padding.left - padding.right);
  var plotHeight = Math.max(1, height - padding.top - padding.bottom);
  var stacked = !!config.stacked;
  var maximum = scaleMaximum(data, config.max, stacked);
  var pointCount = data.points.length;
  var cumulative = new Array(pointCount).fill(0);
  var baselineY = padding.top + plotHeight;
  var xFor = function xFor(index) {
    if (pointCount <= 1) return padding.left + plotWidth / 2;
    return padding.left + (index / (pointCount - 1)) * plotWidth;
  };
  var yFor = function yFor(value) {
    return padding.top + plotHeight - Math.max(0, Math.min(1, value / maximum)) * plotHeight;
  };
  var series = data.series.map(function buildSeries(item) {
    var lowerValues = item.values.map(function lower(_, index) {
      return stacked ? cumulative[index] : 0;
    });
    var upperValues = item.values.map(function upper(value, index) {
      var result = lowerValues[index] + value;
      if (stacked) cumulative[index] = result;
      return result;
    });
    var upperPoints = upperValues.map(function toPoint(value, index) {
      return { x: xFor(index), y: yFor(value), value: item.values[index] };
    });
    var lowerPoints = lowerValues.map(function toPoint(value, index) {
      return { x: xFor(index), y: stacked ? yFor(value) : baselineY, value: value };
    });
    return Object.assign({}, item, {
      upperPoints: upperPoints,
      lowerPoints: lowerPoints,
      linePath: pathFor(upperPoints, config.curve),
      areaPath: pathFor(upperPoints, config.curve) + ' ' + pathFor(lowerPoints.slice().reverse(), config.curve).replace(/^M/, 'L') + ' Z'
    });
  });
  return {
    width: width,
    height: height,
    plotWidth: plotWidth,
    plotHeight: plotHeight,
    baselineY: baselineY,
    scaleMax: maximum,
    series: series,
    xLabels: data.points.map(function toLabel(point, index) {
      return { key: point.key, label: point.label, x: xFor(index) };
    })
  };
}

module.exports = {
  defaultPalette: DEFAULT_PALETTE,
  normalizeAreaItems: normalizeAreaItems,
  scaleMaximum: scaleMaximum,
  curveCommands: curveCommands,
  executeCommands: executeCommands,
  pathFor: pathFor,
  buildAreaGeometry: buildAreaGeometry
};
