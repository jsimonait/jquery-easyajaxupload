/*
// jQuery Easy Ajax File Uploader
//
// @author: jSimonight <jsimonight@gmail.com>
//
// - Ajaxifies an individual <input type="file">
// - Files are sandboxed. Doesn't matter how many, or where they are, on the page.
// - Allows for extra parameters to be included with the file
// - onStart callback can cancel the upload by returning false
// - To submit file invoke $('<input type="file">').easyajaxupload('upload')
*/

(function ($) {
    $.fn.easyajaxupload = function (options) {
        if (this.length == 0 || arguments[0] == undefined) return this; // quick fail

        // Handle API methods
        if (typeof arguments[0] == 'string') {
            // Perform API methods on individual elements
            if (this.length > 1) {
                var args = arguments;
                return this.each(function () {
                    $.fn.easyajaxupload.apply($(this), args);
                });
            };
            // Invoke API method handler
            $.fn.easyajaxupload[arguments[0]].apply(this, $.makeArray(arguments).slice(1) || []);
            
            return this;
        };

        // Initialize options for this call
        var options = $.extend(
            {}/* new object */,
            $.fn.easyajaxupload.options/* default options */,
            options || {} /* just-in-time options */
		);

        $(this).data('easyajaxupload', $.extend({}, options));

        return this; 
    };

    /*
    ### API methods ###
    */
    $.extend($.fn.easyajaxupload, {
        upload: function () {
            // Get element data
            var $elm = $(this);
            var opts = this.data('easyajaxupload'); 

            // Check element data and element value
            if (!opts) return this;
            if ($elm.val() == '') return opts.onCancel.apply($elm);

            // Creates the form, extra inputs and iframe used to 
            //  submit / upload the file
            wrapElement($elm, opts);

            // Call user-supplied (or default) onStart(), setting
            // it's this context to the file DOM element
            var ret = opts.onStart.apply($elm, [opts.params]);

            // let onStart have the option to cancel the upload
            if(ret !== false){
                $elm.parent('form').submit(function(e) { e.stopPropagation(); }).submit();
            }

        }
    });

    /*
    ### Default Settings ###
    */
    $.fn.easyajaxupload.options = {
        action: '',
        params: {},
        onStart: function () { console.log('starting upload'); console.log(this); },
        onComplete: function (response) { console.log('got response: '); console.log(response); console.log(this); },
        onCancel: function () { console.log('cancelling: '); console.log(this); }
    };


    /*
    ### Privete functions ###
    */

    /*
    // Internal handler that tries to parse the response 
    //  and clean up after ourselves. 
    */
    var handleResponse = function (loadedFrame, $element, options) {
        var response, responseStr = loadedFrame.contentWindow.document.body.innerHTML;
        if (!responseStr) return;

        try {
            response = JSON.parse(responseStr);
        } catch (e) {
            response = responseStr;
        }

        // Tear-down the wrapper form
        $element.siblings().remove();
        $element.unwrap();

        // Remove iframe
        $(loadedFrame).remove();

        // Pass back to the user
        options.onComplete.apply($element, [response, options.params]);
    };

    /*
    // Wraps element in a <form> tag, and inserts hidden inputs for each
    //  key:value pair in options.params so they can be sent along with
    //  the upload. Then, creates an iframe that the whole thing is 
    //  uploaded through. 
    */
    var wrapElement = function ($element, options) {
        // Create an iframe to submit through, using a semi-unique ID
        var frameId = 'easyAjaxUploader-iframe-' + Math.round(new Date().getTime() / 1000);
        $('body').after('<iframe width="0" height="0" style="display:none;" name="' + frameId + '" id="' + frameId + '" />');

        $('#' + frameId).load(function () {
            handleResponse(this, $element, options);
        });
        
        // Wrap it in a form
        $element.wrap(function () {
            return '<form action="' + options.action + '" method="POST" enctype="multipart/form-data" target="' + frameId + '" />';
        })
        // Insert <input type='hidden'>'s for each param
        .before(function() {
            var key, html = '';
            for(key in options.params) {
                var paramVal = options.params[key];
                if (typeof paramVal === 'function') {
                    paramVal = paramVal();
                }
                html += '<input type="hidden" name="' + key + '" value="' + paramVal + '" />';
            }
            return html;
        });

    };

})(jQuery)
