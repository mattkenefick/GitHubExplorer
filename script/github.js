String.prototype.replaceKeyValue = function($kv, $prefix) {
    var str = this;
    for (var i in $kv) str = str.replace($prefix + i, $kv[i]);
    return str;
};


function GitHub($user, $repo) {

    var _self = this;
    var _api_v3 = 'https://api.github.com/repos/:user/:repo/contents/?:dir';
    var _raw_v3 = 'https://raw.github.com/:user/:repo/:branch:dir';
    var _options = {
        user: $user,
        repo: $repo
    };
    var _cache = {
        repo: {}
    };

    /**
     * query
     *
     * Call GitHub with a request for user/repo/directory
     * and trigger events after. Build cache for structure.
     */
    this.query = function query($dir) {
        var self = this;
        var dir_ary = !$dir ? [] : ($dir.indexOf('/') < 0 ? [$dir] : $dir.split('/'));
        var url = _api_v3.replaceKeyValue({
            'user': _options.user,
            'repo': _options.repo,
            'dir': $dir ? 'path=' + $dir : ''
        }, ':');

        $.getJSON(url + '&callback=?', function($data) {
            var cache,
                cached;

           // JSONP sends back {meta, data}, so this will equalize it
            $data = $data.data;

            // new repo
            !_cache.repo[_options.repo] && _cache.repo[_options.repo] = {files: [], dirs: {}};

            // set local cache repo var
            cache = _cache.repo[_options.repo];

            // check for directories existing
            if (dir_ary) {
                cached = cache; // used for traversing
                $(dir_ary).each(function($index, $item) {
                    !cached.dirs[$item] && cached.dirs[$item] = {files: [], dirs: {}};
                    cached = cached.dirs[$item];
                });
            }

            // break up children
            $($data).each(function($index, $item) {
                if ($item.type == 'file') {
                    cached.files.push($item);
                }
                else if ($item.type == 'dir') {
                    cached.dirs[$item.name] = {files: [], dirs: {}};
                }
            });

            // fire events to let us know we're set
            $(self).trigger('complete', [cached]);
        });
    };

    /**
     * populate
     *
     * Turn our JSON structure into a HTML list structure
     * and add event handlers
     */
    this.populate = function populate($object, $dir) {
        var el,
            target = $object;

        if ($dir) {
            $object.append('<ul></ul');
            target = $object.find('ul');
        }

        // Add directories
        for (var key in $dir.dirs) {
            target.append('<li class="dir"><span>' + key + '</span></li>');
        };

        // Add files
        for (var key in $dir.files) {
            target.append('<li class="file" data-url="' +
                          $dir.files[key]._links.git +
                          '"><span>' +
                          $dir.files[key].name +
                          '</span></li>');
        };

        // Events
        $object.find('li.dir').on('click', _onDirClick);
        $object.find('li.file').on('click', _onFileClick);
    };

    this.getRawUrl = function($options) {
        return _raw_v3.replaceKeyValue({
            'user': _options.user,
            'repo': _options.repo,
            'branch': $options.branch,
            'dir': $options.dir
        }, ':');
    };

    this.buildStructure = function buildStructure($object) {
        var str = '';

        do {
            if (!$object.is('li')) break;
            str = $object.find('span').html() + '/' + str;
        } while($object = $($object).parent().parent());

        return str.replace(/\/$/, '');
    };

    /**
     * _onFileClick
     */
    function _onFileClick($e) {
        var str = _self.buildStructure($(this)).replace(/\/$/, '');
        var url = $(this).data('url');

        $(_self).trigger('file', [str]);

        $.getJSON(url + '?callback=?', function($data) {
            $(_self).trigger('file_complete', [$data['data'], str]);
        });
    };

    /**
     * _onDirClick
     */
    function _onDirClick($e) {
        var str = _self.buildStructure($(this));

        $(_self).trigger('dir', [$(this), str]);
    };

};