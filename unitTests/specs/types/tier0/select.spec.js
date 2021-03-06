/**
 * Testing select data type 
 */
describe('A select data type', function(){
	'use strict';

	var testContainer = window.formBuilderTesting.testContainer;
	var pause = window.formBuilderTesting.pause;
	var triggerWaitTime = window.formBuilderTesting.triggerWaitTime;

	var typeName = 'select';
	var type = $.formBuilder.inputField.types[typeName];
	var util = $.formBuilder.util;

	describe('can be setup', function(){
		it('is a valid data-type', function(){
			var input = $('<input type="text"/>').wrap('<div/>').inputField();
			var ifw = input.data('formBuilderInputField');
			
			expect(type).toBeDefined();

			ifw.setType(typeName);
			
			expect(util.equals(ifw.getType(), $.formBuilder.inputField.types.text)).toBe(false);
		});

		it('to have an input field with data', function(){
			var input = $('<input type="text" data-type="'+typeName+'" data-options =\'[{"value":"X-Ray", "label":"Xylophone"}, {"value":"Cat", "label":"Cucumber"}]\'/>').appendTo(testContainer).inputField();	
			var ifw = input.data('formBuilderInputField');
			var openIcon = '.fb-icon.fb-icon-sort-up.dropdown-open-icon';
			var closedIcon = '.fb-icon.fb-icon-sort-down.dropdown-closed-icon';

			expect(input.parent().parent().parent().parent().is('.input-field-group')).toBe(true);
			expect(input.parent().is('.field-item.field-item-input.first')).toBe(true);
			expect(input.parent().parent().is('.field-items')).toBe(true);
			expect(input.parent().children().eq(1).is('.fb-icon.fb-icon-sort-up.dropdown-open-icon')).toBe(true);
			expect(input.parent().children().eq(2).is('.fb-icon.fb-icon-sort-down.dropdown-closed-icon')).toBe(true);
			expect(input.parent().parent().parent().is('.input-field.select-box')).toBe(true);
			expect(input.attr('data-options')).toBe('[{"value":"X-Ray", "label":"Xylophone"}, {"value":"Cat", "label":"Cucumber"}]');

			expect(input.siblings().length).toBe(3);
			expect(input.siblings().eq(0).is(openIcon)).toBe(true);
			expect(input.siblings().eq(1).is(closedIcon)).toBe(true);
			expect(input.siblings().eq(2).is('.shim')).toBe(true);
			expect(input.siblings().eq(2).css('position')).toBe('absolute');
			expect(input.siblings().eq(0).css('display')).toBe('none');
			expect(input.siblings().eq(1).css('display')).toBe('block');
			expect(input.siblings().eq(2).css('display')).toBe('block');

			testContainer.empty();
		});

		describe('with a close listener', function(){
			it('that can handle if the escape key is pressed', function(done){
				var input = $('<input type="text" data-type="'+typeName+'" data-options =\'[{"value":"X-Ray", "label":"Xylophone"}, {"value":"Cat", "label":"Cucumber"}]\'/>').inputField();	
				var ifw = input.data('formBuilderInputField');

				var spy_focus = spyOn($.fn, 'focus').and.callThrough();
				var spy_close = spyOn(ifw.getType(), 'close').and.callThrough();

				var ev = $.Event("keydown");
				ev.which = 27; // Escape key code value

				ifw.getType().closeListener(ev);

				pause(triggerWaitTime)
				.then(function(){
					expect(spy_focus).toHaveBeenCalled();
					expect(spy_close).toHaveBeenCalled();

					done(); 
				});
			});

			it('that can handle when the enter key is pressed', function(done){
				var input = $('<input type="text" data-type="'+typeName+'" data-options =\'[{"value":"X-Ray", "label":"Xylophone"}, {"value":"Cat", "label":"Cucumber"}]\'/>').inputField();	
				var ifw = input.data('formBuilderInputField');

				var spy_selected = spyOn(ifw.getType(), '_setSelected').and.callThrough();

				var ev = $.Event("keydown");
				ev.which = 13; // Enter key code value

				ifw.getType().closeListener(ev);

				pause(triggerWaitTime)
				.then(function(){
					expect(spy_selected).toHaveBeenCalled();

					done(); 
				});
			});

			it('that can handle when a key other than the escape or the enter key are pressed', function(done){
				var input = $('<input type="text" data-type="'+typeName+'" data-options =\'[{"value":"X-Ray", "label":"Xylophone"}, {"value":"Cat", "label":"Cucumber"}]\'/>').inputField();	
				var ifw = input.data('formBuilderInputField');

				var spy_focus = spyOn($.fn, 'focus').and.callThrough();
				var spy_selected = spyOn(ifw.getType(), '_setSelected').and.callThrough();

				var ev = $.Event("keydown");
				ev.which = 20; // Capslock key code value
				ev.target = input;

				ifw.getType().closeListener(ev);

				pause(triggerWaitTime)
				.then(function(){
					expect(spy_focus).not.toHaveBeenCalled();
					expect(spy_selected).not.toHaveBeenCalled();

					done(); 
				});
			});
		});

		describe('with a dropdown panel', function(){
			it('with content', function(){
				var input = $('<input type="text" data-type="'+typeName+'" data-options =\'[{"value":"X-Ray", "label":"Xylophone"}, {"value":"Cat", "label":"Cucumber"}, {"value":"Yak", "label": "Yellow"},  {"value":"Book", "label": "Banana"}, {"value":"Zoo", "label": "Zingales"}, {"value":"Aragorn", "label": "Apple"}]\'/>').inputField();	
				var dropDown = input.parent().eq(0).siblings().eq(0);
				var dropSearch = dropDown.children().children().eq(0);  

				expect(input.parent().eq(0).siblings().is('.fb-select-panel')).toBe(true);
				expect(dropDown.is(':visible')).toBe(false);
				expect(dropDown.children().children().length).toBe(2);
				expect(dropDown.css('display')).toBe('none');
				expect(dropDown.children().is('.tms-select-dropdown-content')).toBe(true);
				expect(input.css('opacity')).toBe('0');
				expect(dropDown.children().children().eq(0).is('.search')).toBe(true);
				expect(dropSearch.children().eq(0).is('.input-field.filter-box')).toBe(true); 
				expect(dropDown.children().children().eq(1).is('.options')).toBe(true);
			});

			it('that can handle a click on an option', function(done){
				var input = $('<input type="text" data-type="'+typeName+'" data-options =\'[{"value":"X-Ray", "label":"Xylophone"}, {"value":"Cat", "label":"Cucumber"}]\'/>').inputField();	
				var ifw = input.data('formBuilderInputField');
				var option = input.parent().eq(0).siblings().eq(0).children().children().eq(1).children().children().eq(0);

				var spy_select = spyOn(ifw.getType(), '_setSelected').and.callThrough(); 

				ifw.getType().open();

				option.click();
				pause(triggerWaitTime)
				.then(function(){
					expect(spy_select).toHaveBeenCalled(); 

					done(); 
				});
			});

			it('that can handle a mouseenter on an option', function(done){
				var input = $('<input type="text" data-type="'+typeName+'" data-options =\'[{"value":"X-Ray", "label":"Xylophone"}, {"value":"Cat", "label":"Cucumber"}]\'/>').inputField();	
				var ifw = input.data('formBuilderInputField');
				var option = input.parent().eq(0).siblings().eq(0).children().children().eq(1).children().children().eq(0);
				var option1 = input.parent().eq(0).siblings().eq(0).children().children().eq(1).children().children().eq(1);

				ifw.getType().open(); 

				option.addClass('selected');

				expect(option.is('.option.selected')).toBe(true);
				expect(option1.is('.option.selected')).toBe(false);

				option1.trigger('mouseenter');
				pause(triggerWaitTime)
				.then(function(){
 					expect(option.is('.option.selected')).toBe(false);
 					expect(option1.is('.option.selected')).toBe(true);

					done(); 
				});
			});

			it('that can handle a mouseleave on an option', function(done){
				var input = $('<input type="text" data-type="'+typeName+'" data-options =\'[{"value":"X-Ray", "label":"Xylophone"}, {"value":"Cat", "label":"Cucumber"}]\'/>').inputField();	
				var ifw = input.data('formBuilderInputField');
				var option = input.parent().eq(0).siblings().eq(0).children().children().eq(1).children().children().eq(0);

				ifw.getType().open(); 

				option.addClass('selected');

				expect(option.is('.option.selected')).toBe(true);

				option.trigger('mouseleave');
				pause(triggerWaitTime)
				.then(function(){
 					expect(option.is('.option.selected')).toBe(false);

					done(); 
				});
			});
	
		});

		it('so that it will not display an input field in the dropdown if there are less than five values', function(){
			var input = $('<input type="text" data-type="'+typeName+'" data-options =\'[{"value":"X-Ray", "label":"Xylophone"}, {"value":"Cat", "label":"Cucumber"}, {"value":"Yak", "label": "Yellow"},  {"value":"Book", "label": "Banana"}]\'/>').inputField();	
			var ifw = input.data('formBuilderInputField');
			var panel = input.parent().eq(0).siblings();
			var dropDown = input.parent().eq(0).siblings().eq(0);
			var dropSearch = dropDown.children().children().eq(0); 

			ifw.getType().open(); 

			expect(dropSearch.children().eq(0).css('display')).toBe('none');
		});

		it('so that it will display an input field in the dropdown if there are more than five values', function(){
			var input = $('<input type="text" data-type="'+typeName+'" data-options =\'[{"value":"X-Ray", "label":"Xylophone"}, {"value":"Cat", "label":"Cucumber"}, {"value":"Yak", "label": "Yellow"},  {"value":"Book", "label": "Banana"}, {"value":"Zoo", "label": "Zingales"}, {"value":"Aragorn", "label": "Apple"}]\'/>').inputField();	
			var ifw = input.data('formBuilderInputField');
			var dropDown = input.parent().eq(0).siblings().eq(0);
			var dropSearch = dropDown.children().children().eq(0); 

			ifw.getType().open();  

			expect(dropSearch.children().eq(0).css('display')).toBe('block');
		});

	});

	describe('can detect when an event will be fired on key down', function(){
		it('when the tab key is pressed (nothing happens, keeping for legacy)', function(){
			var input = $('<input type="text" data-type="'+typeName+'" data-options =\'[{"value":"X-Ray", "label":"Xylophone"}, {"value":"Cat", "label":"Cucumber"}]\'/>').inputField();	
			var ifw = input.data('formBuilderInputField');

			var spy_focus = spyOn($.fn, 'focus').and.callThrough();
			var spy_open = spyOn(ifw.getType(), 'open').and.callThrough();

			var ev = $.Event("keydown");
			ev.which = 9; // Tab key code value
			ifw.getType()._keyDownNavigate(ev);

			expect(spy_focus).toHaveBeenCalled();
			expect(spy_open).not.toHaveBeenCalled();
		});
	
		it('when the escape key is pressed', function(){
			var input = $('<input type="text" data-type="'+typeName+'" data-options =\'[{"value":"X-Ray", "label":"Xylophone"}, {"value":"Cat", "label":"Cucumber"}]\'/>').inputField();	
			var ifw = input.data('formBuilderInputField');

			var spy_open = spyOn(ifw.getType(), 'open').and.callThrough();

			var ev = $.Event("keydown");
			ev.which = 27; // Escape key code value
			ifw.getType()._keyDownNavigate(ev);

			expect(spy_open).not.toHaveBeenCalled();

			expect(ev.isDefaultPrevented()).toBe(true); 
			ev.preventDefault(); //just in case
		}); 

		it('when the enter key is pressed', function(){
			var input = $('<input type="text" data-type="'+typeName+'" data-options =\'[{"value":"X-Ray", "label":"Xylophone"}, {"value":"Cat", "label":"Cucumber"}]\'/>').inputField();	
			var ifw = input.data('formBuilderInputField');

			var spy_open = spyOn(ifw.getType(), 'open').and.callThrough();

			var ev = $.Event("keydown");
			ev.which = 13; // Enter key code value
			ifw.getType()._keyDownNavigate(ev);

			expect(spy_open).not.toHaveBeenCalled();

			expect(ev.isDefaultPrevented()).toBe(true); 
			ev.preventDefault(); //just in case
		}); 

		it('when the down arrow key is pressed and an option is selected', function(){
			var input = $('<input type="text" data-type="'+typeName+'" data-options =\'[{"value":"X-Ray", "label":"Xylophone"}, {"value":"Cat", "label":"Cucumber"}, {"value":"Yak", "label": "Yellow"},  {"value":"Book", "label": "Banana"}, {"value":"Zoo", "label": "Zingales"}, {"value":"Aragorn", "label": "Apple"},  {"value":"Eeyore", "label": "Elephant"}, {"value":"Dude", "label": "David"}]\'/>').inputField();	
			var ifw = input.data('formBuilderInputField');
			var options = input.parent().eq(0).siblings().eq(0).children().children().eq(1).children().children();
			var i;

			var spy_scroll = spyOn(ifw.getType(), '_scroll').and.callThrough();
			var spy_find = spyOn($.fn, 'find').and.callThrough();
			var spy_add = spyOn($.fn, 'addClass').and.callThrough();
			var spy_open = spyOn(ifw.getType(), 'open').and.callThrough();

			// Before the keydown the first option should be selected (and no others) 
			expect(options.eq(0).is('.selected')).toBe(true);
			for(i = 1; i < 8; i++)
			{
				expect(options.eq(i).is('.selected')).not.toBe(true);
			}

			// Select an option
			options.eq(3).addClass('selected');

			expect(options.eq(3).is('.selected')).toBe(true);
			expect(options.eq(4).is('.selected')).not.toBe(true);

			var ev = $.Event("keydown");
			ev.which = 40; // Down arrow key code value
			ifw.getType()._keyDownNavigate(ev);

			expect(spy_scroll).toHaveBeenCalled();
			expect(spy_find.calls.count()).toBe(1); 
			expect(spy_add).toHaveBeenCalled(); 
			expect(spy_open).toHaveBeenCalled();

			// Should have selected the next option
			expect(options.eq(3).is('.selected')).not.toBe(true);
			expect(options.eq(4).is('.selected')).toBe(true);
		}); 

		it('when the up arrow key is pressed and an option is selected', function(){
			var input = $('<input type="text" data-type="'+typeName+'" data-options =\'[{"value":"X-Ray", "label":"Xylophone"}, {"value":"Cat", "label":"Cucumber"}, {"value":"Yak", "label": "Yellow"},  {"value":"Book", "label": "Banana"}, {"value":"Zoo", "label": "Zingales"}, {"value":"Aragorn", "label": "Apple"},  {"value":"Eeyore", "label": "Elephant"}, {"value":"Dude", "label": "David"}]\'/>').inputField();	
			var ifw = input.data('formBuilderInputField');
			var options = input.parent().eq(0).siblings().eq(0).children().children().eq(1).children().children();
			var i; 
			var x; 

			var spy_scroll = spyOn(ifw.getType(), '_scroll').and.callThrough();
			var spy_find = spyOn($.fn, 'find').and.callThrough();
			var spy_add = spyOn($.fn, 'addClass').and.callThrough();
			var spy_open = spyOn(ifw.getType(), 'open').and.callThrough(); 

			// Before the keydown the first option should be selected (and no others) 
			expect(options.eq(0).is('.selected')).toBe(true);
			for(i = 1; i < 8; i++)
			{
				expect(options.eq(i).is('.selected')).not.toBe(true);
			}

			// Select an option
			options.eq(4).addClass('selected');

			expect(options.eq(3).is('.selected')).not.toBe(true);
			expect(options.eq(4).is('.selected')).toBe(true);

			var ev = $.Event("keydown");
			ev.which = 38; // Up arrow key code value
			ifw.getType()._keyDownNavigate(ev);

			expect(spy_scroll).toHaveBeenCalled(); 
			expect(spy_find.calls.count()).toBe(1); 
			expect(spy_add).toHaveBeenCalled(); 
			expect(spy_open).toHaveBeenCalled(); 

			// Now the option before the selected option should be the one selected
			expect(options.eq(3).is('.selected')).toBe(true);
			expect(options.eq(4).is('.selected')).not.toBe(true);
		}); 

		it('when a key code that is less than 32 that has not been previously allowed has been used', function(){
			var input = $('<input type="text" data-type="'+typeName+'" data-options =\'[{"value":"X-Ray", "label":"Xylophone"}, {"value":"Cat", "label":"Cucumber"}, {"value":"Yak", "label": "Yellow"},  {"value":"Book", "label": "Banana"}, {"value":"Zoo", "label": "Zingales"}, {"value":"Aragorn", "label": "Apple"},  {"value":"Eeyore", "label": "Elephant"}, {"value":"Dude", "label": "David"}]\'/>').inputField();	
			var ifw = input.data('formBuilderInputField');

			var spy_scroll = spyOn(ifw.getType(), '_scroll').and.callThrough();
			var spy_find = spyOn($.fn, 'find').and.callThrough();
			var spy_add = spyOn($.fn, 'addClass').and.callThrough();
			var spy_open = spyOn(ifw.getType(), 'open').and.callThrough();

			var ev = $.Event("keydown");
			ev.which = 8; // Backspace key code value
			ifw.getType()._keyDownNavigate(ev);

			expect(spy_scroll).not.toHaveBeenCalled(); 
			expect(spy_find).not.toHaveBeenCalled();
			expect(spy_add).not.toHaveBeenCalled(); 
			expect(spy_open).not.toHaveBeenCalled();  
		});

		it('when a key code that is greater than 126 has been used', function(){
			var input = $('<input type="text" data-type="'+typeName+'" data-options =\'[{"value":"X-Ray", "label":"Xylophone"}, {"value":"Cat", "label":"Cucumber"}, {"value":"Yak", "label": "Yellow"},  {"value":"Book", "label": "Banana"}, {"value":"Zoo", "label": "Zingales"}, {"value":"Aragorn", "label": "Apple"},  {"value":"Eeyore", "label": "Elephant"}, {"value":"Dude", "label": "David"}]\'/>').inputField();	
			var ifw = input.data('formBuilderInputField');

			var spy_scroll = spyOn(ifw.getType(), '_scroll').and.callThrough();
			var spy_find = spyOn($.fn, 'find').and.callThrough();
			var spy_add = spyOn($.fn, 'addClass').and.callThrough();
			var spy_open = spyOn(ifw.getType(), 'open').and.callThrough();

			var ev = $.Event("keydown");
			ev.which = 187; // Equals sign key code value
			ifw.getType()._keyDownNavigate(ev);

			expect(spy_scroll).not.toHaveBeenCalled(); 
			expect(spy_find).not.toHaveBeenCalled();
			expect(spy_add).not.toHaveBeenCalled(); 
			expect(spy_open).not.toHaveBeenCalled();  
		});

	});

	it('can detect when an event will be fired on key up', function(){
		var input = $('<input type="text" data-type="'+typeName+'" data-options =\'[{"value":"X-Ray", "label":"Xylophone", "filter":"test"}, {"value":"Cat", "label":"Cucumber"}]\'/>').inputField();	
		var ifw = input.data('formBuilderInputField');
		var typeInstance = ifw.getType();
		var ev = $.Event("keyup");

		var spy_Op = spyOn(typeInstance, '_filterOptions').and.callThrough();

		// keyup event will trigger _onKeyup to have been called 
		typeInstance._onKeyup(ev);

		// We should expect that self.filterValue = '', and val = ''. So the function should not return
		expect(spy_Op).not.toHaveBeenCalled(); 

		
		typeInstance.filter.val('some search');
		typeInstance._onKeyup(ev);

		// We should expect that _filterOptions will be called the second time since self.filterValue and val are not equal to each other 
		expect(spy_Op).toHaveBeenCalled();
	});

	describe('can handle conversion', function(){
		it('using its toField and fromField functions', function(done){
			var input = $('<input type="text" data-type="'+typeName+'" data-options =\'[{"value":"X-Ray", "label":"Xylophone"}, {"value":"Cat", "label":"Cucumber"}, {"value":"Yak", "label": "Yellow"},  {"value":"Book", "label": "Banana"}, {"value":"Zoo", "label": "Zingales"}, {"value":"Aragorn", "label": "Apple"}]\'/>').inputField();	
			var ifw = input.data('formBuilderInputField');
			var param = ifw.getType();
			var option = input.parent().eq(0).siblings().eq(0).children().children().eq(1).children().children().eq(0);

			expect(ifw.get()).toBe('Aragorn');

			expect(option.is('.option.selected')).toBe(true);

			var spy_to = spyOn(ifw.getType().converter, 'toField').and.callThrough();
			var spy_from = spyOn(ifw.getType().converter, 'fromField').and.callThrough();
			var spy_set = spyOn(ifw.getType(), '_set').and.callThrough();
			var spy_rem = spyOn(ifw.getType(), '_removeSelection').and.callThrough();
			var spy_remC = spyOn($.fn, 'removeClass').and.callThrough();

			ifw.set('Cat');
			expect(option.is('.option.selected')).not.toBe(true);
			pause(triggerWaitTime)
			.then(function(){
				expect(ifw.get()).toBe('Cat'); 
				expect(spy_to).toHaveBeenCalled(); 
				expect(spy_from).toHaveBeenCalled(); 
				expect(spy_set).toHaveBeenCalled(); // toField should call _set()
				expect(spy_rem).toHaveBeenCalled();	
				expect(spy_remC).toHaveBeenCalled();		

				expect(option.is('.option')).toBe(true);	

				done();
			});
		});
	});

	it('can open and close dropdown menu on mouseclicks', function(done){
		var input = $('<input type="text" data-type="'+typeName+'" data-options =\'[{"value":"X-Ray", "label":"Xylophone"}, {"value":"Cat", "label":"Cucumber"}, {"value":"Yak", "label": "Yellow"},  {"value":"Book", "label": "Banana"}, {"value":"Zoo", "label": "Zingales"}, {"value":"Aragorn", "label": "Apple"}]\'/>').appendTo(testContainer).inputField();	
		var ifw = input.data('formBuilderInputField');
		var box = $('<body></body>').children().eq(1);

		var spy_tog = spyOn(ifw.getType(), 'toggle').and.callThrough(); 
		var spy_close = spyOn(ifw.getType(), 'close').and.callThrough(); 
		var spy_open = spyOn(ifw.getType(), 'open').and.callThrough(); 
		var spy_closeL = spyOn(ifw.getType(), 'closeListener').and.callThrough(); 
	
		// Before the click the dropdown panel should be set to display:none
		expect(input.parent().eq(0).siblings().eq(0).css('display')).toBe('none');
		expect(input.parent().children().eq(1).css('display')).toBe('none');
		expect(input.parent().children().eq(2).css('display')).toBe('block');

		ifw.layers.items.click();
		pause(triggerWaitTime)
		.then(function(){
			expect(spy_tog).toHaveBeenCalled();
			expect(spy_open).toHaveBeenCalled();

			// After the click the dropdown panel should be set to display:block
			expect(input.parent().eq(0).siblings().eq(0).css('display')).toBe('block');

			// And the icons should switch display statuses
			expect(input.parent().children().eq(1).css('display')).toBe('block');
			expect(input.parent().children().eq(2).css('display')).toBe('none');
			
			$(document).click();
			return pause(triggerWaitTime);
		})
		.then(function(){
			expect(spy_close).toHaveBeenCalled();
			expect(spy_closeL).toHaveBeenCalled();

			expect(input.parent().eq(0).siblings().eq(0).css('display')).toBe('none');
			expect(input.parent().children().eq(1).css('display')).toBe('none');
			expect(input.parent().children().eq(2).css('display')).toBe('block');

			testContainer.empty();

			done();
		});
	});

	it('can toggle dropdown menu on mouseclicks', function(done){
		var input = $('<input type="text" data-type="'+typeName+'" data-options =\'[{"value":"X-Ray", "label":"Xylophone"}, {"value":"Cat", "label":"Cucumber"}, {"value":"Yak", "label": "Yellow"},  {"value":"Book", "label": "Banana"}, {"value":"Zoo", "label": "Zingales"}, {"value":"Aragorn", "label": "Apple"}]\'/>').appendTo(testContainer).inputField();	
		var ifw = input.data('formBuilderInputField');

		var spy_tog = spyOn(ifw.getType(), 'toggle').and.callThrough(); 
		var spy_close = spyOn(ifw.getType(), 'close').and.callThrough(); 
		var spy_open = spyOn(ifw.getType(), 'open').and.callThrough(); 
		var spy_closeL = spyOn(ifw.getType(), 'closeListener').and.callThrough();
	
		// Before the click the dropdown panel should be set to display:none
		expect(input.parent().eq(0).siblings().eq(0).css('display')).toBe('none');
		expect(input.parent().children().eq(1).css('display')).toBe('none');
		expect(input.parent().children().eq(2).css('display')).toBe('block');

		ifw.layers.items.click();
		pause(triggerWaitTime)
		.then(function(){
			expect(spy_tog).toHaveBeenCalled();
			expect(spy_open).toHaveBeenCalled();

			// After the click the dropdown panel should be set to display:block
			expect(input.parent().eq(0).siblings().eq(0).css('display')).toBe('block');

			// And the icons should switch display statuses
			expect(input.parent().children().eq(1).css('display')).toBe('block');
			expect(input.parent().children().eq(2).css('display')).toBe('none');
			
			ifw.layers.items.click();
			return pause(triggerWaitTime);
		})
		.then(function(){
			expect(spy_close).toHaveBeenCalled();
			expect(spy_closeL).toHaveBeenCalled();

			expect(input.parent().eq(0).siblings().eq(0).css('display')).toBe('none');
			expect(input.parent().children().eq(1).css('display')).toBe('none');
			expect(input.parent().children().eq(2).css('display')).toBe('block');

			testContainer.empty();

			done();
		});
	});

	it('can set its\' status when there is no item', function(){
		var input = $('<input type="text" data-type="'+typeName+'" data-options =\'[{"value":"Submitted", "label":"Searched"}, {"value":"Option", "label":"Select"}, {"value":"One", "label":"Two"}, {"value":"Test", "label": "Run"}, {"value":"Try", "label": "Catch"}]\'/>').inputField();	
		var ifw = input.data('formBuilderInputField');

		var spy_rem = spyOn(ifw.getType(), '_removeSelection').and.callThrough(); 
		var spy_find = spyOn($.fn, 'find').and.callThrough(); 
		var spy_hand = spyOn(ifw.getType(), '_handleItemNotFound').and.callThrough();

		ifw.getType()._set();

		expect(spy_rem).toHaveBeenCalled();
		expect(spy_find).toHaveBeenCalled();
		expect(spy_hand).toHaveBeenCalled();
	});

	it('can set its\' status when there is an item', function(){
		var input = $('<input type="text" data-type="'+typeName+'" data-options =\'[{"value":"Submitted", "label":"Searched"}, {"value":"Option", "label":"Select"}, {"value":"One", "label":"Two"}, {"value":"Test", "label": "Run"}, {"value":"Try", "label": "Catch"}]\'/>').inputField();	
		var ifw = input.data('formBuilderInputField');
		var options = input.parent().eq(0).siblings().eq(0).children().children().eq(1).children().children();

		var spy_rem = spyOn(ifw.getType(), '_removeSelection').and.callThrough(); 
		var spy_find = spyOn($.fn, 'find').and.callThrough(); 
		var spy_label = spyOn(ifw.getType(), '_setLabel').and.callThrough();
		var spy_SH = spyOn(ifw.getType(), 'showHideCommand').and.callThrough();
		var spy_hand = spyOn(ifw.getType(), '_handleItemNotFound').and.callThrough();

		expect(options.eq(2).is('.selected')).not.toBe(true);

		var val = {
			value: 'Submitted',
			label: 'Searched'
		};

		ifw.getType()._set(val);

		expect(spy_rem).toHaveBeenCalled();
		expect(spy_find).toHaveBeenCalled();
		expect(spy_label).toHaveBeenCalled();
		expect(spy_SH).toHaveBeenCalled();
		expect(spy_hand).not.toHaveBeenCalled();

		expect(options.eq(2).is('.selected')).toBe(true);
	});

	describe('can type a search in the dropdown input field', function(){
		it('and the correct label will be selected if the correct value is typed in', function(){
			var input = $('<input type="text" data-type="'+typeName+'" data-options =\'[{"value":"Submitted", "label":"Searched"}, {"value":"Option", "label":"Select"}, {"value":"One", "label":"Two"}, {"value":"Test", "label": "Run"}, {"value":"Try", "label": "Catch"}]\'/>').inputField();	
			var ifw = input.data('formBuilderInputField');
			var parameter = ifw.getType();
			var options = input.parent().eq(0).siblings().eq(0).children().children().eq(1).children().children();

			// At this point none of the options should be selected
			expect(options.eq(0).is('.option')).toBe(true);
			expect(options.eq(1).is('.option')).toBe(true);
			expect(options.eq(2).is('.option')).toBe(true);
			expect(options.eq(3).is('.option')).toBe(true);
			expect(options.eq(4).is('.option')).toBe(true);

			ifw.getType().open(); 

			ifw.set('Try');
			$(document).trigger('keyup');

			expect(options.eq(0).is('.selected')).toBe(true);

			ifw.set('');
			ifw.set('Test');
			$(document).trigger('keyup');

			expect(options.eq(1).is('.selected')).toBe(true);

			ifw.set('');
			ifw.set('Submitted');
			$(document).trigger('keyup');

			expect(options.eq(2).is('.selected')).toBe(true);

			ifw.set('');
			ifw.set('Option');
			$(document).trigger('keyup');

			expect(options.eq(3).is('.selected')).toBe(true);

			ifw.set('');
			ifw.set('One');
			$(document).trigger('keyup');

			expect(options.eq(4).is('.selected')).toBe(true);
		});

		it('and an incorrect entry will result in the first item being selected, using scroll', function(){
			var input = $('<input type="text" data-type="'+typeName+'" data-options =\'[{"value":"X-Ray", "label":"Xylophone"}, {"value":"Cat", "label":"Cucumber"}, {"value":"Yak", "label": "Yellow"},  {"value":"Book", "label": "Banana"}, {"value":"Zoo", "label": "Zingales"}, {"value":"Aragorn", "label": "Apple"}]\'/>').inputField();	
			var ifw = input.data('formBuilderInputField');
			var parameter = ifw.getType();
			var options = input.parent().eq(0).siblings().eq(0).children().children().eq(1).children().children();
			var spy = spyOn(ifw.getType(), '_scroll').and.callThrough(); 

			// At this point none of the options should be selected
			expect(options.eq(0).is('.option')).toBe(true);

			ifw.getType().open();
		
			ifw.set('Wrong');
			$(document).trigger('keyup');

			expect(options.eq(0).is('.option.selected')).toBe(true);
			expect(spy).toHaveBeenCalled();
		});

		it('and the shim will hold the correct value', function(){
			var input = $('<input type="text" data-type="'+typeName+'" data-options =\'[{"value":"Submitted", "label":"Searched"}, {"value":"Option", "label":"Select"}, {"value":"One", "label":"Two"}, {"value":"Test", "label": "Run"}, {"value":"Try", "label": "Catch"}]\'/>').inputField();	
			var ifw = input.data('formBuilderInputField');
			var typeInstance = ifw.getType();

			typeInstance.open();

			ifw.set('One');
			$(document).trigger('keyup');

			expect(typeInstance.shim.text()).toBe('Two');
		});

		it('a partial entry will display only relevant labels', function(){
			var input = $('<input type="text" data-type="'+typeName+'" data-options =\'[{"value":"Submitted", "label":"Searched"}, {"value":"Option", "label":"Select"}, {"value":"One", "label":"Two"}, {"value":"Test", "label": "Run"}, {"value":"Try", "label": "Catch"}]\'/>').inputField();	
			var ifw = input.data('formBuilderInputField');
			var options = input.parent().eq(0).siblings().eq(0).children().children().eq(1).children().children();

			var spy_should = spyOn(ifw.getType(), '_itemShoudBeFiltered').and.callThrough();

			//At this point none of the options should be filtered
			expect(options.eq(0).is('.option')).toBe(true);
			expect(options.eq(1).is('.option')).toBe(true);
			expect(options.eq(2).is('.option')).toBe(true);
			expect(options.eq(3).is('.option')).toBe(true);
			expect(options.eq(4).is('.option')).toBe(true);

			var val = 't';

			for(var i = 0; i < 5; i++){
				ifw.getType()._filterItem(options.eq(i), val);
			}

			expect(spy_should).toHaveBeenCalled();

			// Wont be filtered out since they contain the letter T
			expect(options.eq(0).is('.option')).toBe(true);
			expect(options.eq(3).is('.option')).toBe(true); 
			expect(options.eq(4).is('.option')).toBe(true); 

			// Will be filtered out since they do not contain the letter T 
			expect(options.eq(1).is('.option.filtered')).toBe(true);
			expect(options.eq(2).is('.option.filtered')).toBe(true);
		});
	});

	it('can handle when an item has been selected', function(){
		var input = $('<input type="text" data-type="'+typeName+'" data-options =\'[{"value":"X-Ray", "label":"Xylophone"}, {"value":"Cat", "label":"Cucumber"}, {"value":"Yak", "label": "Yellow"},  {"value":"Book", "label": "Banana"}, {"value":"Zoo", "label": "Zingales"}, {"value":"Aragorn", "label": "Apple"}]\'/>').appendTo(testContainer).inputField();	
		var ifw = input.data('formBuilderInputField');
		var typeInstance = ifw.getType();
		var options = input.parent().eq(0).siblings().eq(0).children().children().eq(1).children().children();

		var spy_setLabel = spyOn(typeInstance, '_setLabel').and.callThrough();
		var spy_renderLabel = spyOn(typeInstance, 'renderLabel').and.callThrough();
		var spy_close = spyOn(typeInstance, 'close').and.callThrough(); 
		var spy_focus = spyOn($.fn, 'focus').and.callThrough();
		var spy_change = spyOn($.fn, 'change').and.callThrough();
		var spy_redraw = spyOn(ifw, 'redraw').and.callThrough(); 
		var spy_hide = spyOn(typeInstance, 'showHideCommand').and.callThrough(); 
		var spy_first = spyOn(typeInstance, '_selectFirstNonEmptyOption').and.callThrough(); 

		// If nothing has been selected, first item should be selected 
		typeInstance.open();
		typeInstance._setSelected(); 
		//expect(spy_first).toHaveBeenCalled(); 

		expect(options.eq(0).is('.option.selected')).toBe(true);
		options.eq(0).removeClass('selected');

		// Select another option
		typeInstance.open();
		options.eq(2).addClass('selected');
		typeInstance._setSelected(); 

		// Check that the label has been set correctly 
		expect(spy_renderLabel).toHaveBeenCalled();
		expect(spy_setLabel).toHaveBeenCalled(); 
		expect(typeInstance.shim.text()).toBe('Cucumber'); 

		expect(spy_close).toHaveBeenCalled(); 

		expect(spy_focus).toHaveBeenCalled();
		expect(spy_change).toHaveBeenCalled();
		expect(spy_redraw).toHaveBeenCalled(); 
		expect(spy_hide).toHaveBeenCalled();

		testContainer.empty();
	});

	it('can select the first non-empty option', function(){
		var input = $('<input type="text" data-type="'+typeName+'" data-options =\'[{"value":"X-Ray", "label":"Xylophone"}, {"value":"Cat", "label":"Cucumber"}, {"value":"Yak", "label": "Yellow"},  {"value":"Book", "label": "Banana"}, {"value":"Zoo", "label": "Zingales"}, {"value":"Aragorn", "label": "Apple"}]\'/>').appendTo(testContainer).inputField();	
		var ifw = input.data('formBuilderInputField');
		var option = input.parent().eq(0).siblings().eq(0).children().children().eq(1).children().children();

		var spy_remove = spyOn(ifw.getType(), '_removeSelection').and.callThrough(); 
		var spy_find = spyOn($.fn, 'find').and.callThrough();

		expect(option.eq(0).is('.option')).toBe(true);

		ifw.getType().open();
		ifw.getType()._selectFirstNonEmptyOption(); 

		expect(spy_remove).toHaveBeenCalled(); 
		expect(spy_find).toHaveBeenCalled(); 

		expect(option.eq(0).is('.option.selected')).toBe(true);

		testContainer.empty();
	});

	it('can clear its status', function(){
		var input = $('<input type="text" data-type="'+typeName+'" data-options =\'[{"value":"X-Ray", "label":"Xylophone"}, {"value":"Cat", "label":"Cucumber"}, {"value":"Yak", "label": "Yellow"},  {"value":"Book", "label": "Banana"}, {"value":"Zoo", "label": "Zingales"}, {"value":"Aragorn", "label": "Apple"}]\'/>').inputField();	
		var ifw = input.data('formBuilderInputField');

		var spy_remove = spyOn($.fn, 'removeClass').and.callThrough();
		var spy_handle = spyOn(ifw.getType(), '_handleItemNotFound').and.callThrough();
		var spy_redraw = spyOn(ifw, 'redraw').and.callThrough(); 

		var option = input.parent().eq(0).siblings().eq(0).children().children().eq(1).children().children().eq(0);

		ifw.getType().open();

		option.addClass('selected');
		expect(option.is('.option.selected')).toBe(true);

		ifw.getType().clear();

		expect(spy_remove).toHaveBeenCalled();
		expect(spy_handle).toHaveBeenCalled();
		expect(spy_redraw).toHaveBeenCalled();

		expect(ifw.item).toBe();
		expect(option.is('.option')).toBe(true);
		expect(ifw.getType().shim.text()).toBe('Apple');
	});

	it('can handle when an item that has been selected is not found', function(){
		var input = $('<input type="text" data-type="'+typeName+'" data-options =\'[{"value":"X-Ray", "label":"Xylophone"}, {"value":"Cat", "label":"Cucumber"}, {"value":"Yak", "label": "Yellow"},  {"value":"Book", "label": "Banana"}, {"value":"Zoo", "label": "Zingales"}, {"value":"Aragorn", "label": "Apple"}]\'/>').inputField();	
		var ifw = input.data('formBuilderInputField');
		var option = input.parent().eq(0).siblings().eq(0).children().children().eq(1).children().children();

		var spy_default = spyOn(ifw.getType(), '_setDefaultItem').and.callThrough();

		ifw.getType()._handleItemNotFound();

		expect(spy_default).toHaveBeenCalled();
	});

	it('can set a default item', function(){
		var input = $('<input type="text" data-type="'+typeName+'" data-options =\'[{"value":"X-Ray", "label":"Xylophone"}, {"value":"Cat", "label":"Cucumber"}, {"value":"Yak", "label": "Yellow"},  {"value":"Book", "label": "Banana"}, {"value":"Zoo", "label": "Zingales"}, {"value":"Aragorn", "label": "Apple"}]\' data-default = "Cat"/>').inputField();	
		var ifw = input.data('formBuilderInputField');
		var option = input.parent().eq(0).siblings().eq(0).children().children().eq(1).children().children();

		var spy_add = spyOn($.fn, 'addClass').and.callThrough();
		var spy_label = spyOn(ifw.getType(), '_setLabel').and.callThrough();
		var spy_SH = spyOn(ifw.getType(), 'showHideCommand').and.callThrough();

		expect(option.eq(0).is('.option')).toBe(true);
		expect(option.eq(1).is('.option')).toBe(true);
		expect(option.eq(2).is('.option')).toBe(true);
		expect(option.eq(3).is('.option')).toBe(true);
		expect(option.eq(4).is('.option')).toBe(true);

		ifw.getType()._setDefaultItem(); 

		expect(spy_add).toHaveBeenCalled();
		expect(spy_label).toHaveBeenCalled();
		expect(spy_SH).toHaveBeenCalled();

		expect(option.eq(0).is('.option')).toBe(true);
		expect(option.eq(1).is('.option')).toBe(true);
		expect(option.eq(2).is('.option.selected')).toBe(true); // This option was set to be the default selected in data-options
		expect(option.eq(3).is('.option')).toBe(true);
		expect(option.eq(4).is('.option')).toBe(true);
	}); 

	it('can set a default item', function(){
		var input = $('<input type="text" data-type="'+typeName+'" data-options =\'[{"value":"X-Ray", "label":"Xylophone"}, {"value":"Cat", "label":"Cucumber"}, {"value":"Yak", "label": "Yellow"},  {"value":"Book", "label": "Banana"}, {"value":"Zoo", "label": "Zingales"}, {"value":"Aragorn", "label": "Apple"}]\' data-default = "X-Ray"/>').inputField();	
		var ifw = input.data('formBuilderInputField');
		var option = input.parent().eq(0).siblings().eq(0).children().children().eq(1).children().children();

		var spy_add = spyOn($.fn, 'addClass').and.callThrough();
		var spy_label = spyOn(ifw.getType(), '_setLabel').and.callThrough();
		var spy_SH = spyOn(ifw.getType(), 'showHideCommand').and.callThrough();

		expect(option.eq(0).is('.option')).toBe(true);
		expect(option.eq(1).is('.option')).toBe(true);
		expect(option.eq(2).is('.option')).toBe(true);
		expect(option.eq(3).is('.option')).toBe(true);
		expect(option.eq(4).is('.option')).toBe(true);

		ifw.getType()._setDefaultItem(); 

		expect(spy_add).toHaveBeenCalled();
		expect(spy_label).toHaveBeenCalled();
		expect(spy_SH).toHaveBeenCalled();

		expect(option.eq(0).is('.option')).toBe(true);
		expect(option.eq(1).is('.option')).toBe(true);
		expect(option.eq(2).is('.option')).toBe(true); 
		expect(option.eq(3).is('.option.selected')).toBe(true);  // This option was set to be the default selected in data-options
		expect(option.eq(4).is('.option')).toBe(true);

		ifw.set('Cat');
		expect(option.eq(0).is('.option')).toBe(true);
		expect(option.eq(1).is('.option')).toBe(true); 
		expect(option.eq(2).is('.option.selected')).toBe(true); // This option was set
		expect(option.eq(3).is('.option')).toBe(true);
		expect(option.eq(4).is('.option')).toBe(true);

		ifw.set();
		expect(option.eq(0).is('.option')).toBe(true);
		expect(option.eq(1).is('.option')).toBe(true);
		expect(option.eq(2).is('.option')).toBe(true); 
		expect(option.eq(3).is('.option.selected')).toBe(true);  // This option was set to be the default selected in data-options
		expect(option.eq(4).is('.option')).toBe(true);
	}); 

	it('can select the first item if a default item is not set', function(){
		var input = $('<input type="text" data-type="'+typeName+'" data-options =\'[{"value":"X-Ray", "label":"Xylophone"}, {"value":"Cat", "label":"Cucumber"}, {"value":"Yak", "label": "Yellow"},  {"value":"Book", "label": "Banana"}, {"value":"Zoo", "label": "Zingales"}, {"value":"Aragorn", "label": "Apple"}]\'/>').inputField();	
		var ifw = input.data('formBuilderInputField');
		var option = input.parent().eq(0).siblings().eq(0).children().children().eq(1).children().children().eq(0);

		expect(option.is('.option')).toBe(true);

		var spy_hide = spyOn(ifw.getType(), 'showHideCommand').and.callThrough();
		var spy_label = spyOn(ifw.getType(), '_setLabel').and.callThrough();

		ifw.getType()._selectFirstItem();

		expect(option.is('.option.selected')).toBe(true);
		expect(spy_hide).toHaveBeenCalled();
		expect(spy_label).toHaveBeenCalled();
	});

	describe('can show or hide a command', function(){
		it('with a showClass variable', function(){
			var testForm = $('<form></form>').appendTo(testContainer).formBuilder();
			var aClass = $('<div class="aClass" style="display: block; height: 1em; width: 1em;">visible</div>').appendTo(testForm);
			testForm.find(".aClass").hide();
			var input = $('<input type="text" data-type="'+typeName+'" data-options =\'[{"value":"X-Ray", "label":"Xylophone"}, {"value":"Cat", "label":"Cucumber"}, {"value":"Yak", "label": "Yellow"},  {"value":"Book", "label": "Banana", "showClass":"aClass"}, {"value":"Zoo", "label": "Zingales"}, {"value":"Aragorn", "label": "Apple", "showClass":"bClass"}]\'/>').appendTo(testForm).inputField();	
			var ifw = input.data('formBuilderInputField');
			var option = input.parent().eq(0).siblings().eq(0).children().children().eq(1).children().children();

			expect(aClass.css('display')).toBe('none');

			var spy_showHide = spyOn(ifw.getType(), 'showHideCommand').and.callThrough();
			var spy_hide = spyOn($.fn, 'hide').and.callThrough();
			var spy_filter = spyOn($.fn, 'filter').and.callThrough();

			ifw.getType().open();

			ifw.set('Book');

			expect(spy_showHide).toHaveBeenCalled();
			expect(spy_hide).toHaveBeenCalled();
			expect(spy_filter).toHaveBeenCalled(); 
			expect(aClass.css('display')).toBe('block');

			testContainer.empty();
		});

		it('and it can handle if there is no showClass variable', function(){
			var input = $('<input type="text" data-type="'+typeName+'" data-options =\'[{"value":"X-Ray", "label":"Xylophone"}, {"value":"Cat", "label":"Cucumber"}, {"value":"Yak", "label": "Yellow"},  {"value":"Book", "label": "Banana"}, {"value":"Zoo", "label": "Zingales"}, {"value":"Aragorn", "label": "Apple"}]\'/>').appendTo(testContainer).inputField();	
			var ifw = input.data('formBuilderInputField');
			var option = input.parent().eq(0).siblings().eq(0).children().children().eq(1).children().children();
			var spy_showHide = spyOn(ifw.getType(), 'showHideCommand').and.callThrough();
			var spy_hide = spyOn($.fn, 'hide').and.callThrough();
			var spy_filter = spyOn($.fn, 'filter').and.callThrough();

			ifw.getType().open();

			option.eq(0).click(); 

			expect(spy_showHide).toHaveBeenCalled();
			expect(spy_hide).toHaveBeenCalled();
			expect(spy_filter).not.toHaveBeenCalled(); // Since no showClass variable is set the function will return 

			testContainer.empty();
		});
	}); 

	it('can test if two values are equal to each other', function(){
		var input = $('<input type="text" data-type="'+typeName+'" data-options =\'[{"value":"X-Ray", "label":"Xylophone"}, {"value":"Cat", "label":"Cucumber"}, {"value":"Yak", "label": "Yellow"},  {"value":"Book", "label": "Banana"}, {"value":"Zoo", "label": "Zingales"}, {"value":"Aragorn", "label": "Apple"}]\'/>').inputField();	
		var ifw = input.data('formBuilderInputField');
		var spy_equal = spyOn(ifw.getType(), '_equal').and.callThrough();

		ifw.getType()._set(); 
		ifw.getType()._setDefaultItem(); 

		var test1 = {
			value:"submitted", 
			label:"Searched"
		};
		var test2 = {value:"e",
			label:"z"
		};
		var test3 = {value:"e",
			label:"z"
		};

		var result = ifw.getType()._equal(test1, test2);
		var result2 = ifw.getType()._equal(test3, test2);

		expect(spy_equal).toHaveBeenCalled(); 
		expect(result).toBeFalsy();
		expect(result2).toBeTruthy();
	}); 

	it('can set and get its label', function(){
		var input = $('<input type="text" data-type="'+typeName+'" data-options =\'[{"value":"X-Ray", "label":"Xylophone"}, {"value":"Cat", "label":"Cucumber"}, {"value":"Yak", "label": "Yellow"},  {"value":"Book", "label": "Banana"}, {"value":"Zoo", "label": "Zingales"}, {"value":"Aragorn", "label": "Apple"}]\'/>').inputField();	
		var ifw = input.data('formBuilderInputField');

		ifw.getType()._setLabel("Some label");	
		var result = ifw.getType()._getLabel();

		expect(result).toBe("Some label");
	}); 

	it('can get its options', function(){
		var input = $('<input type="text" data-type="'+typeName+'" data-options =\'[{"value":"X-Ray", "label":"Xylophone"}, {"value":"Cat", "label":"Cucumber"}, {"value":"Yak", "label": "Yellow"},  {"value":"Book", "label": "Banana"}, {"value":"Zoo", "label": "Zingales"}, {"value":"Aragorn", "label": "Apple"}]\'/>').inputField();	
		var ifw = input.data('formBuilderInputField');

		// Create object to test equality of result 
		var mainObject = [{value: 'Aragorn', label: 'Apple'},{value: 'Book',label: 'Banana'},{value: 'Cat',label: 'Cucumber'},{value: 'X-Ray',label: 'Xylophone'},{value: 'Yak',label: 'Yellow'},{value: 'Zoo',label: 'Zingales'}];

		var result = ifw.getType().getOptions(); 

		expect(result).toEqual(mainObject); 
	});


	it('can remove a selection', function(){
		var input = $('<input type="text" data-type="'+typeName+'" data-options =\'[{"value":"X-Ray", "label":"Xylophone"}, {"value":"Cat", "label":"Cucumber"}, {"value":"Yak", "label": "Yellow"},  {"value":"Book", "label": "Banana"}, {"value":"Zoo", "label": "Zingales"}, {"value":"Aragorn", "label": "Apple"}]\'/>').inputField();	
		var ifw = input.data('formBuilderInputField');
		var options = input.parent().eq(0).siblings().eq(0).children().children().eq(1).children().children();
 
		var spy_remC = spyOn($.fn, 'removeClass').and.callThrough(); 

		// At this point the first option should be selected
		expect(options.eq(0).is('.selected')).toBe(true);
		expect(options.eq(1).is('.selected')).not.toBe(true);
		expect(options.eq(2).is('.selected')).not.toBe(true);
		expect(options.eq(3).is('.selected')).not.toBe(true);
		expect(options.eq(4).is('.selected')).not.toBe(true);

		ifw.getType().open();
		ifw.set('Book');

		expect(options.eq(0).is('.selected')).not.toBe(true);
		expect(options.eq(1).is('.selected')).toBe(true);
		expect(options.eq(2).is('.selected')).not.toBe(true);
		expect(options.eq(3).is('.selected')).not.toBe(true);
		expect(options.eq(4).is('.selected')).not.toBe(true);

		ifw.getType()._removeSelection();

		expect(spy_remC).toHaveBeenCalled();

		expect(options.eq(0).is('.selected')).not.toBe(true);
		expect(options.eq(1).is('.selected')).not.toBe(true);
		expect(options.eq(2).is('.selected')).not.toBe(true);
		expect(options.eq(3).is('.selected')).not.toBe(true);
		expect(options.eq(4).is('.selected')).not.toBe(true);
	});

	describe('has a filter', function(){
		it('that can handle clicks', function(done){
			var input = $('<input type="text" data-type="'+typeName+'" data-options =\'[{"value":"X-Ray", "label":"Xylophone"}, {"value":"Cat", "label":"Cucumber"}]\'/>').inputField();	
			var ifw = input.data('formBuilderInputField');
			var filter = input.parent().eq(0).siblings().children().children().eq(0).children().eq(0).find('input');

			var ev = $.Event('click');  
			filter.trigger(ev);

			filter.click();

			pause(triggerWaitTime)
			.then(function(){
				expect(ev.isDefaultPrevented()).toBe(true); 
				expect(ev.isPropagationStopped()).toBe(true);

				done(); 
			});
		});

		it('that can handle a dirty status', function(done){
			var input = $('<input type="text" data-type="'+typeName+'" data-options =\'[{"value":"X-Ray", "label":"Xylophone"}, {"value":"Cat", "label":"Cucumber"}]\'/>').inputField();	
			var ifw = input.data('formBuilderInputField');
			var filter = input.parent().eq(0).siblings().children().children().eq(0).children().eq(0).find('input');

			var ev = $.Event('dirty');  
			filter.trigger(ev);

			pause(triggerWaitTime)
			.then(function(){
				expect(ev.isDefaultPrevented()).toBe(true); 
				expect(ev.isPropagationStopped()).toBe(true);

				done();
			});
		});

		it('that can handle a clean status', function(done){
			var input = $('<input type="text" data-type="'+typeName+'" data-options =\'[{"value":"X-Ray", "label":"Xylophone"}, {"value":"Cat", "label":"Cucumber"}]\'/>').inputField();	
			var ifw = input.data('formBuilderInputField');
			var filter = input.parent().eq(0).siblings().children().children().eq(0).children().eq(0).find('input');

			var ev = $.Event('clean');  
			filter.trigger(ev);

			pause(triggerWaitTime)
			.then(function(){
				expect(ev.isDefaultPrevented()).toBe(true); 
				expect(ev.isPropagationStopped()).toBe(true);

				done();
			});
		});

		it('that can filter its\' options', function(done){
			var input = $('<input type="text" data-type="'+typeName+'" data-options =\'[{"value":"X-Ray", "label":"Xylophone"}, {"value":"Cat", "label":"Cucumber"}, {"value":"Yak", "label": "Yellow"},  {"value":"Book", "label": "Banana"}, {"value":"Zoo", "label": "Zingales"}, {"value":"Aragorn", "label": "Apple"}]\'/>').inputField();	
			var ifw = input.data('formBuilderInputField');

			var spy_work = spyOn(ifw.getType(), '__filterOptionsWork').and.callThrough();
			var spy_remove = spyOn(ifw.getType(), '_removeSelection').and.callThrough();
			var spy_add = spyOn($.fn, 'addClass').and.callThrough();

			ifw.getType()._filterOptions(); 

			pause(200)
			.then(function(){
				expect(spy_remove).toHaveBeenCalled();
				expect(spy_add).toHaveBeenCalled();
				expect(spy_work).toHaveBeenCalled();	

				done(); 
			});		
		});

		it('that can filter its\' options\' work', function(){
			var input = $('<input type="text" data-type="'+typeName+'" data-options =\'[{"value":"X-Ray", "label":"Xylophone"}, {"value":"Cat", "label":"Cucumber"}, {"value":"Yak", "label": "Yellow"},  {"value":"Book", "label": "Banana"}, {"value":"Zoo", "label": "Zingales"}, {"value":"Aragorn", "label": "Apple"}]\'/>').inputField();	
			var ifw = input.data('formBuilderInputField');

			var spy_add = spyOn($.fn, 'addClass').and.callThrough();
			var spy_filter = spyOn(ifw.getType(), '_filterItem').and.callThrough();

			ifw.getType().__filterOptionsWork();

			expect(spy_add).toHaveBeenCalled();	
			expect(spy_filter).toHaveBeenCalled();	

			expect(input.parent().eq(0).siblings().is('.fb-select-panel.filtering')).toBe(true);
		});

		it('that can filter the item selected', function(done){
			var input = $('<input type="text" data-type="'+typeName+'" data-options =\'[{"value":"X-Ray", "label":"Xylophone"}, {"value":"Cat", "label":"Cucumber"}, {"value":"Yak", "label": "Yellow"},  {"value":"Book", "label": "Banana"}, {"value":"Zoo", "label": "Zingales"}, {"value":"Aragorn", "label": "Apple"}]\'/>').inputField();	
			var ifw = input.data('formBuilderInputField');

			var spy_item = spyOn(ifw.getType(), '_filterItem').and.callThrough();

			ifw.getType().__filterOptionsWork(); 

			expect(input.parent().eq(0).siblings().is('.fb-select-panel.filtering')).toBe(true);

			expect(spy_item).toHaveBeenCalled(); 

			pause(triggerWaitTime)
			.then(function(){
				expect(input.parent().eq(0).siblings().is('.fb-select-panel')).toBe(true);

				done();
			});

		});

		it('that can check if the item is filtered', function(){
			var input = $('<input type="text" data-type="'+typeName+'" data-options =\'[{"value":"X-Ray", "label":"Xylophone"}, {"value":"Cat", "label":"Cucumber"}, {"value":"Yak", "label": "Yellow"},  {"value":"Book", "label": "Banana"}, {"value":"Zoo", "label": "Zingales"}, {"value":"Aragorn", "label": "Apple"}]\'/>').appendTo(testContainer).inputField();	
			var ifw = input.data('formBuilderInputField');

			var result = ifw.getType()._itemShoudBeFiltered('test'); 

			expect(result).toBeFalsy();  // Should be false since there is no 'val' passed in

			var result2 = ifw.getType()._itemShoudBeFiltered('test', 1); 

			expect(result2).toBeTruthy();

			var attempt = { label: "try"};

			testContainer.empty(); 
		});

		it('that can be cleared', function(done){
			var input = $('<input type="text" data-type="'+typeName+'" data-options =\'[{"value":"X-Ray", "label":"Xylophone"}, {"value":"Cat", "label":"Cucumber"}, {"value":"Yak", "label": "Yellow"},  {"value":"Book", "label": "Banana"}, {"value":"Zoo", "label": "Zingales"}, {"value":"Aragorn", "label": "Apple"}]\'/>').inputField();	
			var ifw = input.data('formBuilderInputField');

			var spy_remove = spyOn($.fn, 'removeClass').and.callThrough();
			var option = input.parent().eq(0).siblings().eq(0).children().children().eq(1).children().children().eq(3);

			option.addClass('filtered');

			pause(triggerWaitTime)
			.then(function(){
				expect(option.is('.option.filtered')).toBe(true);

				ifw.getType()._clearFilter(); 

				return pause(triggerWaitTime);
			})
			.then(function(){
				expect(spy_remove).toHaveBeenCalled(); 

				expect(option.is('.option')).toBe(true);

				done();
			});
		});

	}); 

	describe('can build an empty option', function(){
		it('without an empty-label',function(){
			var input = $('<input type="text" data-type="'+typeName+'" data-options =\'[{"value":"X-Ray", "label":"Xylophone"}, {"value":"Cat", "label":"Cucumber"}, {"value":"Yak", "label": "Yellow"},  {"value":"Book", "label": "Banana"}, {"value":"Zoo", "label": "Zingales"}, {"value":"Aragorn", "label": "Apple"}]\'/>').inputField();	
			var ifw = input.data('formBuilderInputField');
			var option = input.parent().eq(0).siblings().eq(0).children().children().eq(1).children().children();

			ifw.getType()._buildEmptyOption(); 

			expect(option.eq(0).text()).toBe('Apple'); // Contains the text of the first element that comes first alphabetically 
			expect(option.eq(1).text()).toBe('Banana');
			expect(option.eq(2).text()).toBe('Cucumber');
			expect(option.eq(3).text()).toBe('Xylophone');
			expect(option.eq(4).text()).toBe('Yellow');
			expect(option.eq(5).text()).toBe('Zingales');

			// Will return immediately since there is no set empty label 
		});

		it('with an empty-label', function(){
			var input = $('<input type="text" data-type="'+typeName+'" data-options =\'[{"value":"X-Ray", "label":"Xylophone"}, {"value":"Cat", "label":"Cucumber"}, {"value":"Yak", "label": "Yellow"},  {"value":"Book", "label": "Banana"}, {"value":"Zoo", "label": "Zingales"}, {"value":"Aragorn", "label": "Apple"}]\' data-empty-label="Test"/>').inputField();	
			var ifw = input.data('formBuilderInputField');
			var option = input.parent().eq(0).siblings().eq(0).children().children().eq(1).children().children();

			ifw.getType()._buildEmptyOption(); 

			expect(option.eq(0).text()).toBe('Test'); // Contains the element with a label and no other data, is not placed alphabetically 

			// All the remaining values will have been shifted down one spot 
			expect(option.eq(1).text()).toBe('Apple'); 
			expect(option.eq(2).text()).toBe('Banana');
			expect(option.eq(3).text()).toBe('Cucumber');
			expect(option.eq(4).text()).toBe('Xylophone');
			expect(option.eq(5).text()).toBe('Yellow');
			expect(option.eq(6).text()).toBe('Zingales');
		});

	}); 

	it('can build options', function(){
		var input = $('<input type="text" data-type="'+typeName+'" data-options =\'[{"value":"X-Ray", "label":"Xylophone"}, {"value":"Cat", "label":"Cucumber"}, {"value":"Yak", "label": "Yellow"},  {"value":"Book", "label": "Banana"}, {"value":"Zoo", "label": "Zingales"}, {"value":"Aragorn", "label": "Apple"}]\'/>').inputField();	
		var ifw = input.data('formBuilderInputField');

		var spy_empty = spyOn($.fn, 'empty').and.callThrough();
		var spy_trigger = jasmine.createSpy('event');
		var spy_Bempty = spyOn(ifw.getType(), '_buildEmptyOption').and.callThrough(); 
		var spy_render = spyOn(ifw.getType(), 'renderItem').and.callThrough();
		var spy_append = spyOn($.fn, 'append').and.callThrough();
		var spy_sort = spyOn(ifw.getType(), '_sort').and.callThrough();

		input.on('tmsselectbeforebuild', spy_trigger);

		ifw.getType()._buildOptions(); 

		expect(spy_trigger).toHaveBeenCalled(); 
		expect(spy_empty).toHaveBeenCalled();
		expect(spy_Bempty).toHaveBeenCalled();
		expect(spy_render).toHaveBeenCalled();
		expect(spy_append).toHaveBeenCalled();
		expect(spy_sort).toHaveBeenCalled();
	}); 

	it('can sort', function(){
		var input = $('<input type="text" data-type="'+typeName+'" data-options =\'[{"value":"X-Ray", "label":"Xylophone"}, {"value":"Cat", "label":"Cucumber"}, {"value":"Yak", "label": "Yellow"},  {"value":"Book", "label": "Banana"}, {"value":"Zoo", "label": "Zingales"}, {"value":"Aragorn", "label": "Apple"}]\'/>').inputField();	
		var ifw = input.data('formBuilderInputField');

		var spy_sort = spyOn($.fn, 'sort').and.callThrough();
		var options = input.parent().eq(0).siblings().eq(0).children().children().eq(1).children().children().eq(0);
		var option = input.parent().eq(0).siblings().eq(0).children().children().eq(1).children().children();

		ifw.getType()._sort(options); 

		expect(spy_sort).toHaveBeenCalled();

		// Expect the options to be alphabetical 
		expect(option.eq(0).text()).toBe('Apple');
		expect(option.eq(1).text()).toBe('Banana');
		expect(option.eq(2).text()).toBe('Cucumber');
		expect(option.eq(3).text()).toBe('Xylophone');
		expect(option.eq(4).text()).toBe('Yellow');
		expect(option.eq(5).text()).toBe('Zingales');
	}); 

	it('can scroll', function(done){
		var input = $('<input type="text" data-type="'+typeName+'" data-options =\'[{"value":"X-Ray", "label":"Xylophone"}, {"value":"Cat", "label":"Cucumber"}, {"value":"Yak", "label": "Yellow"},  {"value":"Book", "label": "Banana"}, {"value":"Zoo", "label": "Zingales"}, {"value":"Aragorn", "label": "Apple"},  {"value":"Eeyore", "label": "Elephant"}, {"value":"Dude", "label": "David"}, {"value":"Lion", "label": "Lettuce"},  {"value":"Frida", "label": "Fancy"},  {"value":"Window", "label": "Washer"}, {"value":"Orange", "label": "Oval"},  {"value":"Pineapple", "label": "Penguin"},  {"value":"Goodie", "label": "Gelatin"},  {"value":"King", "label":"Kevin"}]\'/>').appendTo(testContainer).inputField();	
		var ifw = input.data('formBuilderInputField');
		var parameter = ifw.getType();
		var panel = input.parent().eq(0).siblings();
		var options = input.parent().eq(0).siblings().eq(0).children().children().eq(1);
		var selected;

		var scroll = options.scrollTop();			

		ifw.getType()._scroll(); // Call the scroll function

		pause(triggerWaitTime)
		.then(function(){
			expect(scroll).toBe(options.scrollTop());

			ifw.set('Dude');
			selected = options.children().children().eq(3);

			scroll = options.scrollTop();	

			panel.show(); 
			ifw.getType()._scroll(); // Call the scroll function
			return pause(triggerWaitTime);
		})
		.then(function(){
			expect(scroll).not.toBe(options.scrollTop());

			expect(options.scrollTop()).toBe(selected.before().outerHeight(true) + selected.before().before().outerHeight(true));

			selected.removeClass('selected');
			ifw.getType()._scroll(); // Call the scroll function
			return pause(triggerWaitTime);
		})
		.then(function(){
			expect(options.scrollTop()).toBe(0);			

			testContainer.empty(); 

			done(); 
		});

	});

	it('can open a panel if it is not already visible', function(){
		var input = $('<input type="text" data-type="'+typeName+'" data-options =\'[{"value":"X-Ray", "label":"Xylophone"}, {"value":"Cat", "label":"Cucumber"}, {"value":"Yak", "label": "Yellow"},  {"value":"Book", "label": "Banana"}, {"value":"Zoo", "label": "Zingales"}, {"value":"Aragorn", "label": "Apple"}]\'/>').appendTo(testContainer).inputField();	
		var ifw = input.data('formBuilderInputField');
		var option = input.parent().eq(0).siblings().eq(0).children().children().eq(1).children().children().eq(0);

		var spy_trigger = jasmine.createSpy('event');		
		input.on('click keyup', spy_trigger);

		var spy_hide = spyOn($.fn, 'hide').and.callThrough(); 
		var spy_show = spyOn($.fn, 'show').and.callThrough();
		var spy_focus = spyOn($.fn, 'focus').and.callThrough();
		var spy_scroll = spyOn(ifw.getType(), '_scroll').and.callThrough();	
		var spy_listen = spyOn(ifw.getType(), 'closeListener').and.callThrough(); 	

		var dropDown = input.parent().eq(0).siblings().eq(0); 

		expect(dropDown.css('display')).toBe('none');

		ifw.getType().open(); 

		expect(spy_trigger).not.toHaveBeenCalled();
		expect(spy_listen).not.toHaveBeenCalled();
		expect(spy_hide).toHaveBeenCalled();
		expect(spy_show).toHaveBeenCalled();
		expect(spy_focus).toHaveBeenCalled();
		expect(spy_scroll).toHaveBeenCalled();

		expect(dropDown.css('display')).toBe('block');

		ifw.getType().open();

		// These should not have been called an additional time
		// Since the panel is already visible 
		expect(spy_hide.calls.count()).toBe(1);
		expect(spy_show.calls.count()).toBe(2);
		expect(spy_focus.calls.count()).toBe(1);
		expect(spy_scroll.calls.count()).toBe(1);

		// closelistener should be triggered on keyup 
		$(document).trigger('keyup');
		expect(spy_listen).toHaveBeenCalled();

		// closelistener should be triggered again on click()
		$(document).click();
		expect(spy_listen.calls.count()).toBe(2);

		testContainer.empty(); 

	});

	it('can render a label', function(){
		var input = $('<input type="text" data-type="'+typeName+'" data-options =\'[{"value":"X-Ray", "label":"Xylophone"}, {"value":"Cat", "label":"Cucumber"}, {"value":"Yak", "label": "Yellow"},  {"value":"Book", "label": "Banana"}, {"value":"Zoo", "label": "Zingales"}, {"value":"Aragorn", "label": "Apple"}]\'/>').inputField();	
		var ifw = input.data('formBuilderInputField');

		var item = {
			value: 'Some value',
			label: 'Some label'
		};

		var result = ifw.getType().renderLabel(item);

		expect(result).toBe('Some label');
	}); 

	it('can render an item', function(){
		var input = $('<input type="text" data-type="'+typeName+'" data-options =\'[{"value":"X-Ray", "label":"Xylophone"}, {"value":"Cat", "label":"Cucumber"}, {"value":"Yak", "label": "Yellow"},  {"value":"Book", "label": "Banana"}, {"value":"Zoo", "label": "Zingales"}, {"value":"Aragorn", "label": "Apple"}]\'/>').inputField();	
		var ifw = input.data('formBuilderInputField');

		var result = ifw.getType().renderItem(input);

		expect(result).not.toBeNull();
	}); 

	it('can close a panel', function(){
		var input = $('<input type="text" data-type="'+typeName+'" data-options =\'[{"value":"X-Ray", "label":"Xylophone"}, {"value":"Cat", "label":"Cucumber"}, {"value":"Yak", "label": "Yellow"},  {"value":"Book", "label": "Banana"}, {"value":"Zoo", "label": "Zingales"}, {"value":"Aragorn", "label": "Apple"}]\'/>').appendTo(testContainer).inputField();	
		var ifw = input.data('formBuilderInputField');
		var panel = input.parent().eq(0).siblings();
		var option = input.parent().eq(0).siblings().eq(0).children().children().eq(1).children().children().eq(0);

		var spy_hide = spyOn($.fn, 'hide').and.callThrough();
		var spy_show = spyOn($.fn, 'show').and.callThrough();
		var spy_clear = spyOn(ifw.getType(), '_clearFilter').and.callThrough();
		var spy_listen = spyOn(ifw.getType(), 'closeListener').and.callThrough(); 	

		ifw.getType().open();

		expect(input.siblings().eq(0).css('display')).toBe('block'); // Icons' original visibility status 
		expect(input.siblings().eq(1).css('display')).toBe('none');

		ifw.getType().close(); 

		expect(spy_hide).toHaveBeenCalled(); 
		expect(panel.css('display')).toBe('none');

		expect(spy_clear).toHaveBeenCalled(); // Test clear filter

		expect(spy_show).toHaveBeenCalled(); 
		expect(input.siblings().eq(0).css('display')).toBe('none'); // Icons' visibility status should have changed after calling open()
		expect(input.siblings().eq(1).css('display')).toBe('block');

		// Since closelistener has been turned off from click and keyup it should not be triggered
		$(document).trigger('keyup');
		expect(spy_listen).not.toHaveBeenCalled();

		$(document).click();
		expect(spy_listen).not.toHaveBeenCalled();

		testContainer.empty(); 

	}); 

	it('can be updated', function(done){
		var input = $('<input type="text" data-type="'+typeName+'" data-options =\'[{"value":"X-Ray", "label":"Xylophone"}, {"value":"Cat", "label":"Cucumber"}, {"value":"Yak", "label": "Yellow"},  {"value":"Book", "label": "Banana"}, {"value":"Zoo", "label": "Zingales"}, {"value":"Aragorn", "label": "Apple"}]\'/>').inputField();	
		var ifw = input.data('formBuilderInputField');

		var spy_def = spyOn($, 'Deferred').and.callThrough();
		var spy_each = spyOn($, 'each').and.callThrough();
		var spy_load = spyOn(ifw.getType(), 'load').and.callThrough();
		var spy_build = spyOn(ifw.getType(), '_buildOptions').and.callThrough();    
		var spy_sh = spyOn(ifw.getType(), 'showHideCommand').and.callThrough(); 

		var result = ifw.getType().update(); 

		pause(triggerWaitTime)
		.then(function() {
			expect(spy_def).toHaveBeenCalled();
			expect(spy_load).toHaveBeenCalled();
			expect(spy_build).toHaveBeenCalled();
			expect(spy_sh).toHaveBeenCalled(); 
			expect(spy_each).toHaveBeenCalled(); 
			expect(result).not.toBeNull(); 
		
			done(); 
		});

	}); 


	it('can load its values', function(done){
		// returns a sorted array of objects that have value and label properties

		var mainObject = [{value: 'X-Ray', label: 'Xylophone'},{value: 'Cat',label: 'Cucumber'},{value: 'Yak',label: 'Yellow'},{value: 'Book',label: 'Banana'},{value: 'Zoo',label: 'Zingales'},{value: 'Aragorn',label: 'Apple'}];

		var input = $('<input type="text" data-type="'+typeName+'" data-options =\''+JSON.stringify(mainObject)+'\'/>').inputField();	
		var ifw = input.data('formBuilderInputField');
		var source = []; 

		var result_dfd = ifw.getType().load();

		expect(result_dfd).not.toBeNull(); 

		result_dfd.done(function(source){
			expect(util.equals(source, mainObject)).toBe(true);

			done();
		});
	});

	it('can create a map', function(){
		var input = $('<input type="text" data-type="'+typeName+'" data-options =\'[{"value":"X-Ray", "label":"Xylophone"}, {"value":"Cat", "label":"Cucumber"}, {"value":"Yak", "label": "Yellow"},  {"value":"Book", "label": "Banana"}, {"value":"Zoo", "label": "Zingales"}, {"value":"Aragorn", "label": "Apple"}]\'/>').inputField();	
		var ifw = input.data('formBuilderInputField');

		var result = {
			label: '',
			value: ''
		};

		result = ifw.getType().map('test');

		expect(result.label).toBe('test'); 
		expect(result.value).toBe('test'); 
	});

	it('can de-map itself', function(){
		var input = $('<input type="text" data-type="'+typeName+'" data-options =\'[{"value":"X-Ray", "label":"Xylophone"}, {"value":"Cat", "label":"Cucumber"}, {"value":"Yak", "label": "Yellow"},  {"value":"Book", "label": "Banana"}, {"value":"Zoo", "label": "Zingales"}, {"value":"Aragorn", "label": "Apple"}]\'/>').inputField();	
		var ifw = input.data('formBuilderInputField');

		var result = ifw.getType().deMap('test');

		expect(result).toBeNull(); // Should be null since parameter passed in is not an object 

		var object = {
			label: 'Some Label',
			value: 'Some Value'
		};

		var result2 = ifw.getType().deMap(object);

		expect(result2).toBe('Some Value');
	}); 

	it('can set and get its values', function(){
		var input = $('<input type="text" data-type="'+typeName+'" data-options=\'[{"value":"X-Ray", "label":"Xylophone"}, {"value":"Cat", "label":"Cucumber"}, {"value":"Yak", "label": "Yellow"},  {"value":"Book", "label": "Banana"}, {"value":"Zoo", "label": "Zingales"}, {"value":"Aragorn", "label": "Apple"}]\'/>').appendTo(testContainer).inputField();
		var ifw = input.data('formBuilderInputField');

		ifw.set('test'); 

		expect(ifw.get()).toBe('Aragorn');

		testContainer.empty();
	});

	describe('can be set dynamically', function(){
		var sOptionsOne = [
				{value:"true",	label:"Yes"},
				{value:"false",	label:"No"},
				{value:"5",		label:"option 1"},
				{value:"2",		label:"option 2"},
				{value:"3",		label:"option 3"},
				{value:"4",		label:"option 4"},
				{value:"5",		label:"option 5"},
				{value:"100",	label:"Some label"},
				{value:"AAA",	label:"123 Some St."},
				{value:"BBB",	label:"Some Business Name Inc."},
				{value:"Hodor",	label:"Bran"}
			];

		var sOptionsTwo = [
			{value:"some",	label:"Different Option"},
			{value:"value",	label:"Different Souce"},
			{value:"here",	label:"Settable with function"}
		];

		it('can toggle the options that will be displayed', function(){
			var input = $('<input type="text" data-type="'+typeName+'"/>').inputField();
			var ifw = input.data('formBuilderInputField');
			var typeInstance = ifw.getType();

			var first_op = input.parent().siblings().eq(0).children().children().eq(1).children().children().eq(0).text();

			typeInstance.setOptions(sOptionsOne);

			first_op = input.parent().siblings().eq(0).children().children().eq(1).children().children().eq(0).text();

			expect(first_op).toBe('123 Some St.');


			typeInstance.setOptions(sOptionsTwo);

			first_op = input.parent().siblings().eq(0).children().children().eq(1).children().children().eq(0).text();

			expect(first_op).toBe('Different Option');
		});

		it('and the selected option will dissapear when the options are changed', function(done){
			var input = $('<input type="text" data-type="'+typeName+'"/>').appendTo(testContainer).inputField();
			var ifw = input.data('formBuilderInputField');
			var typeInstance = ifw.getType();

			typeInstance.setOptions(sOptionsTwo);

			var second_op = input.parent().siblings().eq(0).children().children().eq(1).children().children().eq(1);

			input.click();
			pause(triggerWaitTime)
			.then(function(){
				second_op.click();

				return pause(triggerWaitTime);
			})
			.then(function(){
				expect(typeInstance.shim.text()).toBe('Different Option');

				typeInstance.setOptions(sOptionsOne);

				return pause(triggerWaitTime);
			})
			.then(function(){
				expect(typeInstance.shim.text()).toBe('Different Option');

				testContainer.empty();
				done();
			});
		});

		it('can have tooltips for items that overflow the view');
	});

	it('Empty Value Parameter', function () {
		var select = $('<input name="category" data-empty-label="No Value Here" data-type="select" data-options=\'[{"value": "b","label": "B"},{"value": "a","label": "A"}]\'>').wrap('<div/>').inputField(),
			type = select.inputField('getType');

		expect(select.inputField('get')).toBeFalsy();
		
		var options = type.panel.find('.option');
		expect(options.length).toEqual(3);

		var emptyOption = type.panel.find('.option').eq(0);
		expect(emptyOption.html()).toEqual('No Value Here');
	});

	it('Empty Value Parameter of Empty String', function () {
		var select = $('<input name="category" data-empty-label="" data-type="select" data-options=\'[{"value": "b","label": "B"},{"value": "a","label": "A"}]\'>').wrap('<div/>').inputField(),
			type = select.inputField('getType');

		expect(select.inputField('get')).toBeFalsy();

		var options = type.panel.find('.option');
		expect(options.length).toEqual(3);

		var emptyOption = type.panel.find('.option').eq(0);
		expect(emptyOption.html()).toEqual('');
		expect(emptyOption.height()).toEqual(20);
	});

	it('Default Selection', function () {
		var select = $('<input name="category" data-no-sort="true"  data-type="select" data-options=\'[{"value": "b","label": "B"},{"value": "a","label": "A"}]\'>').wrap('<div/>').inputField();
		expect(select.inputField('get')).toEqual('b');
	});

	it('Default Selection (select first like HTML select)', function () {
		var select = $('<input name="category" data-no-sort="true" data-type="select" data-options=\'[{"value": "b","label": "B"},{"value": "a","label": "A"}]\'>').wrap('<div/>').inputField();
		expect(select.inputField('get')).toEqual('b');
		select.inputField('set');
		expect(select.inputField('get')).toEqual('b');
		select.inputField('set','a');
		select.inputField('set', null);
		expect(select.inputField('get')).toEqual('b');
		select.inputField('set', 'bugusValue');
		expect(select.inputField('get')).toEqual('b');
	});

	it('Default Selection with empty label', function () {
		var select = $('<input name="category" data-empty-label="" data-no-sort="true"  data-type="select" data-options=\'[{"value": "b","label": "B"},{"value": "a","label": "A"}]\'>').wrap('<div/>').inputField();
		expect(select.inputField('get')).toBeFalsy();
		select.inputField('set');
		expect(select.inputField('get')).toBeFalsy();
		select.inputField('set','a');
		select.inputField('set', null);
		expect(select.inputField('get')).toBeFalsy();
		select.inputField('set', 'bugusValue');
		expect(select.inputField('get')).toBeFalsy();
	});

	it('Default Selection with sorting', function ()  {
		var select = $('<input name="category" data-no-sort="false"  data-type="select" data-options=\'[{"value": "b","label": "B"},{"value": "a","label": "A"}]\'>').wrap('<div/>').inputField();
		expect(select.inputField('get')).toEqual('a');
		select.inputField('set');
		expect(select.inputField('get')).toEqual('a');
		select.inputField('set','a');
		select.inputField('set', null);
		expect(select.inputField('get')).toEqual('a');
		select.inputField('set', 'bugusValue');
		expect(select.inputField('get')).toEqual('a');
	});

	it('Default Selection with sorting', function ()  {
		var select = $('<input name="category" data-default="c"  data-type="select" data-options=\'[{"value": "b","label": "B"},{"value": "a","label": "A"}, {"value": "c","label": "C"}]\'>').wrap('<div/>').inputField();
		expect(select.inputField('get')).toEqual('c');
		select.inputField('set');
		expect(select.inputField('get')).toEqual('c');
		select.inputField('set', null);
		expect(select.inputField('get')).toEqual('c');
		select.inputField('set', 'bugusValue');
		expect(select.inputField('get')).toEqual('c');
	});
 });