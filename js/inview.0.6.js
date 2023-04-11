/*
	Toggle class/fire event for viewport intersections
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

const InView = function(selector, user_options){
	
	user_options = ((typeof(user_options) === 'object') ? user_options : {});

	const _ = this;
	
	_.selector = selector;
	
	_.items = document.querySelectorAll(_.selector);
	
	_.observer = null;
	
	_.defaults = {/* Default Options */
		hidden : 'inview--hidden',/* ClassName to be added when element is outside the viewport */
		partial : 'inview--partial',/* ClassName to be added when element is partially in view */
		visible : 'inview--full',/* ClassName to be added when element is fully in view */
		steps : 10,
		once: false
	};
	
	_.options = {};
	
	_.merge = function(o1, o2, deep){
		deep = ((typeof(deep) === 'undefined') ? false : true);
		const o3 = {};
		Object.keys(o1).forEach((k1) => {
			if(k1 in o2){
				if(deep && typeof(o2[k1]) === 'object' && !('length' in o2[k1])){
					o3[k1] = _.merge(o1[k1], o2[k1]);
				} else {
					o3[k1] = o2[k1];
				}
			} else {
				o3[k1] = o1[k1];
			}
		});
		Object.keys(o2).forEach((k2) => {
			if(!(k2 in o3)){
				if(k2 in o1){
					if(deep && typeof(o1[k2]) === 'object' && !('length' in o1[k2])){
						o3[k2] = _.merge(o2[k2], o1[k2]);
					} else {
						o3[k2] = o1[k2];
					}
				} else {
					o3[k2] = o2[k2];
				}
			}
		});
		return o3;
	};
	
	_.event_dispatch = function(name, node){
		try {
			const event = new Event(name);
			node.dispatchEvent(event);
		} catch(e){/* Ancient Browser */
			const event = document.createEvent('Event');
			event.initEvent(name, true, true);
			node.dispatchEvent(event);
		}
	};
	
	_.view_check_item = function(entry){
		const target = entry.target;
		if(Math.floor(entry.intersectionRatio)){
			if(!target.classList.contains(_.options.visible)){
				if(_.options.hidden.length && _.options.hidden !== _.options.visible){
					target.classList.remove(_.options.hidden);
				}
				if(_.options.partial.length && _.options.partial !== _.options.visible){
					target.classList.remove(_.options.partial);
				}
				if(_.options.visible.length){
					target.classList.add(_.options.visible);
					if(_.options.once){
						_.observer.unobserve(target);
					}
				}
				if(typeof(_.options.onshow) === 'function'){
					_.options.onshow(target);
				}
				_.event_dispatch('inview_visible', target);
			}
		} else if(entry.intersectionRatio){
			if(!target.classList.contains(_.options.partial)){
				if(_.options.hidden.length && _.options.hidden !== _.options.partial){
					target.classList.remove(_.options.hidden);
				}
				if(_.options.partial.length){
					target.classList.add(_.options.partial);
					if(_.options.once && !_.options.visible.length){
						_.observer.unobserve(target);
					}
				}
				if(_.options.visible.length && _.options.visible !== _.options.partial){
					target.classList.remove(_.options.visible);
				}
				if(typeof(_.options.onpartial) === 'function'){
					_.options.onpartial(target);
				}
				_.event_dispatch('inview_partial', target);
			}
		} else {
			if(!target.classList.contains(_.options.hidden)){
				if(_.options.hidden.length){
					target.classList.add(_.options.hidden);
				}
				if(_.options.partial.length && _.options.partial !== _.options.hidden){
					target.classList.remove(_.options.partial);
				}
				if(_.options.visible.length && _.options.visible !== _.options.hidden){
					target.classList.remove(_.options.visible);
				}
				if(typeof(_.options.onhide) === 'function'){
					_.options.onhide(target);
				}
				_.event_dispatch('inview_hidden', target);
			}
		}
		if(!target.matches(_.selector)){
			_.observer.unobserve(target);
		}
	};
	
	_.view_check = function(observer_entries){
		observer_entries.forEach(_.view_check_item);
	};
	
	_.thresholds_get = function(){
		const step = 1 / _.options.steps;
		let i = step;
		const ratios = [0];
		while(i < 1){
			ratios.push(i);
			i += step;
		}
		ratios.push(1);
		return ratios;
	};

	_.init = function(){
	
		_.options = _.merge(_.defaults, user_options);
		
		if(_.items.length){
				
			_.observer = new IntersectionObserver(_.view_check, {
				root: null,
				rootMargin: '0px',
				threshold: _.thresholds_get()
			});

			_.items.forEach(function(item){
				_.observer.observe(item);
				if(typeof(_.options.onbind) === 'function'){
					_.options.onbind(item);
				}
			});
			
			_.event_dispatch('inview_initialised', window);
		
		}
		
	};
	
	_.fallback = function(){
		if(_.items.length){
			_.items.forEach((item) => {
				item.classList.remove(_.options.hidden);
				item.classList.remove(_.options.partial);
				item.classList.add(_.options.visible);
				_.event_dispatch('inview_visible', item);
			});
		}
	};
	
	if(typeof(IntersectionObserver) !== 'undefined'){
		_.init();
	} else {
		_.fallback();
	}

};
