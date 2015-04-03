;(function() {
  'use strict';

  sigma.utils.pkg('sigma.canvas.edges');

  /**
   * This edge renderer will display edges as corners
   *
   * @param  {object}                   edge         The edge object.
   * @param  {object}                   source node  The edge source node.
   * @param  {object}                   target node  The edge target node.
   * @param  {CanvasRenderingContext2D} context      The canvas context.
   * @param  {configurable}             settings     The settings function.
   */
  sigma.canvas.edges.corner = function(edge, source, target, context, settings) {
    var color = edge.color,
        prefix = settings('prefix') || '',
        edgeColor = settings('edgeColor'),
        defaultNodeColor = settings('defaultNodeColor'),
        defaultEdgeColor = settings('defaultEdgeColor'),
		size = edge[prefix + 'size'] || 1,
        tSize = target[prefix + 'size'],
        sX = source[prefix + 'x'],
        sY = source[prefix + 'y'],
        tX = target[prefix + 'x'],
        tY = target[prefix + 'y'],
        aSize = Math.max(size * 2.5, settings('minArrowSize')),
		endType = edge.endType || "def", // edge end types: def, arrow, block
		curveDirection = edge.curveDirection || "tgt"; //src or tgt
		
	var cX = curveDirection == "tgt" ? sX : tX,
		cY = curveDirection == "tgt" ? tY : sY,
		d = Math.sqrt(Math.pow(tX - cX, 2) + Math.pow(tY - cY, 2)),
        aX = cX + (tX - cX) * (d - aSize - tSize) / d,
        aY = cY + (tY - cY) * (d - aSize - tSize) / d,
        vX = (tX - cX) * aSize / d,
        vY = (tY - cY) * aSize / d;

	if (!color)
	  switch (edgeColor) {
		case 'source':
		  color = source.color || defaultNodeColor;
		  break;
		case 'target':
		  color = target.color || defaultNodeColor;
		  break;
		default:
		  color = defaultEdgeColor;
		  break;
	}

	context.strokeStyle = color;
	context.lineWidth = size;
	context.beginPath();
	context.moveTo(sX, sY);
	context.lineTo(cX, cY);
	if(endType === "arrow" || endType === "block"){
		context.lineTo(aX, aY);
	} else{
		context.lineTo(tX, tY);
	}
	context.stroke();
	
	if(endType === "arrow"){
		context.fillStyle = color;
		context.beginPath();
		context.moveTo(aX + vX, aY + vY);
		context.lineTo(aX + vY * 0.6, aY - vX * 0.6);
		context.lineTo(aX - vY * 0.6, aY + vX * 0.6);
		context.lineTo(aX + vX, aY + vY);
		context.closePath();
		context.fill();
	} else if(endType === "block"){
		var bX = cX + (tX - cX) * (d - aSize / 2 - tSize) / d,
			bY = cY + (tY - cY) * (d - aSize / 2 - tSize) / d;
		
		context.fillStyle = color;
		context.lineWidth = aSize;
		context.beginPath();
		context.moveTo(bX + vY, bY - vX);
		context.lineTo(bX - vY, bY + vX);
		context.closePath();
		context.fill();
		context.stroke();
	}
  };
})();
