/*
	Toggle class for viewport interssections
	- 2018-08-13 Jake Nicholson (github.com/shakyjake)
	
	This is free and unencumbered software released into the public domain.

	Anyone is free to copy, modify, publish, use, compile, sell, or
	distribute this software, either in source code form or as a compiled
	binary, for any purpose, commercial or non-commercial, and by any
	means.
	
	In jurisdictions that recognize copyright laws, the author or authors
	of this software dedicate any and all copyright interest in the
	software to the public domain. We make this dedication for the benefit
	of the public at large and to the detriment of our heirs and
	successors. We intend this dedication to be an overt act of
	relinquishment in perpetuity of all present and future rights to this
	software under copyright law.
	
	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
	EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
	IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR
	OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
	ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
	OTHER DEALINGS IN THE SOFTWARE.
	
	For more information, please refer to <http://unlicense.org/>
*/

var ViewTracker;

ViewTracker = function(Selector, UserOptions, CallBack){

	var _ = this;
	
	_.Items = document.querySelectorAll(Selector);
	
	_.Observer = null;
	
	_.CallBack = CallBack;
	_.UseCallBack = false;
	
	_.Options = {/* Default Options */
		Hidden : 'Hidden',/* ClassName to be added when element is outside the viewport */
		Partial : 'PartialView',/* ClassName to be added when element is partially in view */
		Visible : 'InView',/* ClassName to be added when element is fully in view */
	};
	
	if(typeof(CallBack) === 'undefined' && typeof(UserOptions) === 'function'){
		_.CallBack = UserOptions;
		UserOptions = {};
	} else if(typeof(UserOptions) === 'undefined'){
		UserOptions = {};
	}
	if(typeof(_.CallBack) === 'function'){
		_.UseCallBack = true;
	}
	
	_.Options.Hidden = typeof(UserOptions.Hidden) === 'undefined' ? _.Options.Hidden : UserOptions.Hidden;
	_.Options.Partial = typeof(UserOptions.Partial) === 'undefined' ? _.Options.Partial : UserOptions.Partial;
	_.Options.Visible = typeof(UserOptions.Visible) === 'undefined' ? _.Options.Visible : UserOptions.Visible;
	
	_.ClassMatcher = function(Class){
		var RE = new RegExp('(^|(\\s+))' + Class + '($|(\\s+))');
		RE.global = true;
		return RE;
	};
	
	_.AddClass = function(Element, Class){
		_.RemoveClass(Element, Class);
		if(!!Element.className.length){
			Element.className += ' ';
		}
		Element.className += Class;
		return Element;
	};
	
	_.RemoveClass = function(Element, Class){
		Element.className = Element.className.replace(_.ClassMatcher(Class), '');
		return Element;
	};
	
	_.HasClass = function(Element, Class){
		return _.ClassMatcher(Class).test(Element.className);
	};
	
	_.CheckView = function(Entries){
		Entries.forEach(function(Entry){
			if(_.UseCallBack){
				CallBack(Entry.target, Entry.intersectionRatio);
			} else {
				var Target;
				Target = Entry.target;
				if(Math.floor(Entry.intersectionRatio) === 1){
					if(!_.HasClass(Entry, _.Options.Visible)){
						_.RemoveClass(Target, _.Options.Hidden);
						_.RemoveClass(Target, _.Options.Partial);
						_.AddClass(Target, _.Options.Visible);
					}
				} else if(Entry.intersectionRatio > 0){
					if(!_.HasClass(Entry, _.Options.Partial)){
						_.RemoveClass(Target, _.Options.Hidden);
						_.AddClass(Target, _.Options.Partial);
						_.RemoveClass(Target, _.Options.Visible);
					}
				} else {
					if(!_.HasClass(Entry, _.Options.Hidden)){
						_.AddClass(Target, _.Options.Hidden);
						_.RemoveClass(Target, _.Options.Partial);
						_.RemoveClass(Target, _.Options.Visible);
					}
				}
			}
		});
	
	};

	_.Initialise = function(){
		
		if(!!_.Items.length){
		
			_.Observer = new IntersectionObserver(_.CheckView, {
				root: null,
				rootMargin: '0px',
				threshold: [0, 1]
			});

			_.Items.forEach(function(Item){
				_.Observer.observe(Item);
			});
		
		}
		
	};
	
	if(typeof(IntersectionObserver) !== 'undefined'){
	
		_.Initialise();
	
	}

};
