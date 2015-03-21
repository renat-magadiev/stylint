'use strict';

// dont throw false positives on user created names or syntax
var ignoreMeRe = /[&$.#(=>]|({[\S]+})|(if)|(for)|(else)|(@block)/,
	attributeRe = /\[\S+\]/,
	isNumRe = /\d(?=[px]|%|[em]|[rem]|[vh]|[vw]|[vmin]|[vmax]|[ex]|[ch]|[mm]|[cm]|[in]|[pt]|[pc]|[mozmm])/;

/**
* check against a JSON of all valid css properties and values
* @returns false if property or value not considered valid
* @returns true if valid
* @returns undefined if not testable (hmmm)
*/
module.exports = function checkForValidProperties( line, valid ) {
	if ( typeof line !== 'string' ||
		typeof valid === 'undefined' ) {
		return;
	}

	// split by tabs and spaces, tabs mess with pattern matching
	var arr = line.split(/[\s\t,:]/),
		isValid = false;

	// remove white space
	arr = arr.filter(
		function( str ) {
			return str.length > 0;
		}
	);

	// not empty, not something we ignore
	if ( !ignoreMeRe.test( line ) &&
		this.state.hash === false &&
		typeof arr[0] !== 'undefined' ) {

		valid.css.forEach(function( val, index ) {
			var i = 0,
				j = 0;

			if ( arr[ 0 ] === val ) {
				isValid = true;
				return;
			}

			for ( i; i < valid.prefixes.length; i++ ) {
				if ( arr[ 0 ] === ( valid.prefixes[ i ] + val ) ) {
					isValid = true;
					return;
				}
			}

			for ( j; j < valid.pseudo.length; j++ ) {
				if ( arr[ 0 ] === ( val + valid.pseudo[ j ] ) ) {
					isValid = true;
					return;
				}
			}
		});

		valid.html.forEach(function( val, index ) {
			var i = 0,
				j = 0;

			if ( arr[ 0 ] === val ) {
				isValid = true;
				return;
			}

			for ( j; j < valid.pseudo.length; j++ ) {
				if ( attributeRe.test( arr[0] ) ) {
					arr[0] = arr[0].replace(attributeRe, '');
				}

				if ( arr[ 0 ] === ( val + valid.pseudo[ j ] ) ) {
					isValid = true;
					return;
				}
			}
		});

		// for keyframes, temporary solution hopefully
		if ( isNumRe.test( arr[0] ) ) {
			isValid = true;
		}
	}
	else {
		isValid = true;
	}

	// return true if valid match found
	if ( isValid ) {
		return true;
	}
	else {
		return false;
	}
 }
