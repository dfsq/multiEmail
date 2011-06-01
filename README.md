## multiEmail jQuery plugin ##

Plugin transforms specified form field into multi-email form widget. It allows you to input several email addresses instead of one.

### Available options ###

The are number of options available to use:

* max: [Number:null] - Maximum number of emails allowed to input.
* fieldClass: [String:multiemail-cont] Css class name for the main container.
* addClass: [String:null] Additional css class to be added to the main container.
* fieldCss: [Object:null] Css rules to be applyed to the main container.
* placeholder: [String:null] To use some placeholder value, e.g. "Type email address", etc.
* values: [String:null] Comma-separated list of initially set emails.
* removeHtml: [String:'x'] Symbol in place of remove email element. Maybe html-entity, html-image, text, etc.
* label: [Bollean:true] Whether to use label for this email field. Label should have "for" attribute which is the same as the name of the email field.

### Example of usage ###

<pre><code>$('#email').multiEmail({
    placeholder: 'Contact emails',
    fieldCss: {
        width: '350px'
    },
    max: 5
});</code></pre>

[View demo page].

[view demo page]: http://dfsq.info/projects/multiEmail