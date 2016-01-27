var SP = (function () {
    'use strict';

    var player = document.getElementById('player');
    var pause = document.getElementById('pause');
    var play = document.getElementById('play');
    var queue = [];
    var opts = {};
    var clickEvents = ['click', 'onclick'];
   

    var plugin = {
        config: function (options) {
            //if HTML5 audio is not supported DIE!!!
            var res = typeof (player.play) == 'undefined' ? false : true;
            if (res === false) {
                console.log('HTML5 audio not supported');
                return;
            }
            //end
            opts = {
                playlist: options.playlist,
                autoplay: options.autoplay || false,
                selectors: {
                    playlist: document.getElementById(options.selectors.playlist) || 'document.getElementById("playlist")',
                    art: document.getElementById(options.selectors.art) || 'document.getElementById("album-art")',
                    title: document.getElementById(options.selectors.title) || 'document.getElementById("playing-title")',
                    artist: document.getElementById(options.selectors.artist) || 'document.getElementById("playing-artist")',
                    shuffle: document.getElementById(options.selectors.shuffle) || 'document.getElementById("shuffle-play")'
                }
            };

            plugin.assembleHTML(opts);
        },

        assembleHTML: function (opts) {
            var ul = document.createElement('ul');
            opts.selectors.playlist.appendChild(ul);
            opts.playlist.forEach(function (val, ix) {
                var li = document.createElement('li');
                li.setAttribute('data-src', val.track);
                li.setAttribute('data-queue', ix);
                li.setAttribute('data-art', val.art);
                li.setAttribute('class', 'track');
                queue.push(li);

                /*Add title*/
                var title = document.createElement('p');
                title.setAttribute('class', 'title');
                title.innerHTML = val.title;
                li.appendChild(title);
                /*add title*/

                /*add artist*/
                var artist = document.createElement('span');
                artist.setAttribute('class', 'artist');
                artist.innerHTML = val.artist;
                li.appendChild(artist);
                /*add artist*/

                /*add artist*/
                var album = document.createElement('span');
                album.setAttribute('class', 'album');
                album.innerHTML = val.album;
                li.appendChild(album);
                /*add artist*/

                ul.appendChild(li);
                plugin.attachEvent(li, plugin.playTrack, clickEvents);

                //post proc
                //first load
                if (opts.autoplay === true) {
                    plugin.playTrack(ul.getElementsByTagName('li')[0]);
                }
                plugin.attachEvent(opts.selectors.shuffle, plugin.shuffle, clickEvents);
                plugin.attachEvent(document.getElementById('prev'), plugin.prevTrack, clickEvents);
                plugin.attachEvent(document.getElementById('next'), plugin.nextTrack, clickEvents);
            });
        },

        attachEvent: function (el, func, arr) {
            var e1 = arr[0]; //event1
            var e2 = arr[1]; //event2
            el[window.addEventListener ? 'addEventListener' : 'attachEvent'](window.addEventListener ? e1 : e2, func, false);
        },

        playTrack: function (elem) {
            var item = elem.target ? elem.target.nodeName == 'LI' ? elem.target : elem.target.parentNode : elem;
            player.setAttribute('src', item.getAttribute('data-src'));
            plugin.removeClass();
            plugin.addClass(item, 'active');
            plugin.updatePlaying(item);
            plugin.play();
            plugin.attachEvent(pause, plugin.pause, clickEvents);
            plugin.attachEvent(play, plugin.play, clickEvents);
            plugin.queue(item.getAttribute('data-queue'));
            var albumart = 'background:' + "url('" + item.getAttribute('data-art') + "')";
            opts.selectors.art.setAttribute('style', albumart);
        },

        updatePlaying: function (current) {
            var title = current.getElementsByClassName('title')[0].innerHTML;
            var artist = current.getElementsByClassName('artist')[0].innerHTML;
            opts.selectors.title.innerHTML = title;
            opts.selectors.artist.innerHTML = artist;
        },

        play: function () {
            player.play();
            pause.setAttribute('style', 'display:block');
            play.setAttribute('style', 'display:none');
        },

        pause: function () {
            player.pause();
            play.setAttribute('style', 'display:block');
            pause.setAttribute('style', 'display:none');
        },

        queue: function (i) {
            var n = Number(i) + 1;
            var elem = document.getElementsByClassName('track')[n];
            if (elem === null) {
                elem = document.getElementsByClassName('track')[0];
            }
            player.onended = function () {
                plugin.nextSong(elem);
            };
        },

        shuffle: function () {
            var randIndx = (Math.random() * (queue.length - 0) + 0).toFixed(0); //generate a valid random indx
            var elem = queue[randIndx];
            plugin.playTrack(elem);
        },

        nextSong: function (elem) {
            plugin.playTrack(elem);
        },

        nextTrack: function () {
            var current = document.getElementsByClassName('active')[0].getAttribute('data-queue');
            var n = Number(current) + 1;
            var elem = document.getElementsByClassName('track')[n];
            if (elem === null) {
                elem = document.getElementsByClassName('track')[0];
            }
            plugin.playTrack(elem);
        },

        prevTrack: function () {
            var current = document.getElementsByClassName('active')[0].getAttribute('data-queue');
            var n = Number(current) - 1;
            var elem = n >= 0 ? document.getElementsByClassName('track')[n] : document.getElementsByClassName('track')[queue.length - 1];
            plugin.playTrack(elem);
        },

        addClass: function (elem, value) {
            elem.className += ' ' + value;
        },

        removeClass: function () {
            var ul = opts.selectors.playlist.getElementsByTagName('ul')[0];
            var li = ul.getElementsByClassName('active');
            if (li.length > 0) {
                li[0].className = 'track';
            }
        }
    };

    //return the plugin
    return plugin;

})();
