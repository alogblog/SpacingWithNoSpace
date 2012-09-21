/*
 * SpacingWithNoSpace
 * Copyright (c) 2012 Lee KyungJoon - http://alogblog.com
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of the GNU General Public License as published by
 *   the Free Software Foundation, either version 3 of the License, or
 *   (at your option) any later version.
 *
 *   This program is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *   GNU General Public License for more details.
 *
 *   You should have received a copy of the GNU General Public License
 *   along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * @projectDescription JS Class to use spacing without space.
 * @author Lee KyungJoon
 * @version 1.0
 */
SpacingWithNoSpace = function(decorator_odd, decorator_even, filter, spacer)
{
	this.decorator_odd = decorator_odd ? decorator_odd : this.__defaultDecoratorOdd;
	this.decorator_even = decorator_even ? decorator_even : this.__defaultDecoratorEven;
	this.filter = filter ? filter : this.__defaultFilter;
	this.spaceElement = this.__spacerWrapper(spacer);
};

SpacingWithNoSpace.prototype = {
	__even_odd :  0,
	recurse : function(startNode)
	{
		var children = startNode.childNodes;
		var i = children.length;
		while(i > 0)
		{
			// Node Tree의 변경때문에, 뒤에서부터 바꾼다.
			var node = children[--i];
			if(node.nodeType == 1)
			{
				if(this.filter(node))
				{
					this.recurse(node);
				}
			}
			else if(node.nodeType == 3)
			{
				if(/\S/.test(node.nodeValue))
				{
					this.__replace( node, this.__splitString2NodeArray(node.nodeValue) );
				}
			}
		}
	},
	__replace : function(currentNode, arr)
	{
		if(arr != null && arr != currentNode.nodeValue)
		{
			var parent = currentNode.parentNode;
			if(this.__isArray(arr))
			{
				for(var i = 0, l = arr.length; i < l; i++)
				{
					parent.insertBefore( this.__string2TextNode(arr[i]), currentNode );
					if(this.spaceElement && i != arr.length-1)
					{
						parent.insertBefore( this.spaceElement.cloneNode(true), currentNode );
					}
				}
				parent.removeChild(currentNode);
			}
		}
	},
	__isArray : function(obj)
	{
		return ( Object.prototype.toString.call( obj ) === '[object Array]' );
	},
	__string2TextNode : function (data)
	{
		if( typeof data === 'string' )
		{
			data = document.createTextNode(data);
		}
		return data;
	},
	__defaultDecoratorOdd : function(str)
	{
	    var e = document.createElement("b");
	    e.appendChild(document.createTextNode(str));
	    return e;
	},
	__defaultDecoratorEven : function(str)
	{
		// Do Nothing.
	    return str;
	},
	__spacerWrapper : function(spacer)
	{
		// this.spacer()의 결과는 node/textNode/null이다.
		var e = (spacer) ? spacer() : null;
		if(typeof e === 'string') {
			if(e == '')
			{
				return null;
			}
			return this.__string2TextNode(e);
		}
	    return e;
	},
	__defaultFilter : function(node)
	{
		 return node.nodeName != 'PRE';
	},
	__splitString2NodeArray : function(text)
	{
	    var data = text.trim().split(/\s+/);
	    var len = data.length;
		this.__even_odd = ((this.__even_odd + len) % 2);
	    for(var i=0; i<len; i++)
		{
			var txt = data[i];
			data[i] = (i % 2 == this.__even_odd) ? this.decorator_odd(txt) : this.decorator_even(txt);
	    }
	    return data;
	}
};