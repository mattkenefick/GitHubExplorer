function GitHubTree($target, $github, $dir) {

    var _self = this;
    var _tree = $target;
    var _github = $github;
    var _dir = ($dir ? ($dir + '/').replace('//', '/') : '').replace(/\/$/, '');


    // Public Methods ____________________________________________________

    this.init = function() {

        // Open / Close on tree
        self.addEvents();

        // Kick off
        _github.query(_dir);

        $(_github).one('complete', function($e, $dir) {
            _github.populate($target, $dir);
        });

        // Click events for directory / loaded files
        $(_github).bind('dir', _onDirClick);
        $(_github).bind('file_complete', _onFileClick);

    };

    this.addEvents = function() {
        // reset events, then apply live events for all files/dir
        $('body').off('click');
        $('body').on('click', 'li.dir span', function() {
            $(this).parent('li').toggleClass('open');
        });

        $('body').on('click', 'li.file span', function() {
            $('li.file').removeClass('open');
            $(this).parent('li').toggleClass('open');
        });
    };


    // Private Methods ____________________________________________________

    function _onDirClick($e, $target, $dir) {
        if ($target.hasClass('loaded')) return;
        $target.addClass('loaded');

        _github.query((_dir ? _dir + '/' : '') + $dir);

        $(_github).one('complete', function($e, $dir) {
            _github.populate($target, $dir);
        });
    };

    function _onFileClick($e, $data, $file) {
        $(_self).trigger('file', [atob($data.content.split("\n").join('').trim()), $file]);
    };


    // Construct ____________________________________________________
    _self.init();

};
