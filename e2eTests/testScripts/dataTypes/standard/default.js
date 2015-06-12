/**
 * Testing undefined data-type
 *
 * Default is type 'text'
 */

module.exports = function(app) {
	describe('"default"', function() {
		beforeEach(function(done){
			// Setup client
			this.client = app.webdriver.remote(app.clientSetup)
				.init()
				.url(app.urls.index)
				.execute(function(){
					type = '';
					tf = $('form#testForm');
					tf.append('<input type="text" data-type="'+type+'">');
					tf.formBuilder();
					field = tf.find('.input-field');
					ifw = field.find('input');
				}, done);
		});
		afterEach(function(done){
			// close client
			this.client.end();
			done();
		});

		it("Field construction", function(done){
			this.client
				.execute(function(){
					return [
						{val: field.children('.field-items').children().length, equal: 1, because: "Checking number of field-items"},
						{val: field.find('.field-items .field-item.field-item-input input').data('type'), equal: type, because: "Checking correct type"},
						{val: ifw.data('type'), equal: type, because: "Checking correct type from widget"}
					];
				}, function(err,ret){
					app.batchExpect(ret.value);
					done();
				});
		});

		//other tests handled under 'text'
	});
};