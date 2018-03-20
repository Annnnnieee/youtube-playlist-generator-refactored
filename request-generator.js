var requestGenerator = (function () {
    
    function createResource(properties) {
        var resource = {};
        var normalizedProps = properties;
        for (var p in properties) {
            var value = properties[p];
            if (p && p.substr(-2, 2) == '[]') {
                var adjustedName = p.replace('[]', '');
                if (value) {
                    normalizedProps[adjustedName] = value.split(',');
                }
                delete normalizedProps[p];
            }
        }
        for (var p in normalizedProps) {
            // Leave properties that don't have values out of inserted resource.
            if (normalizedProps.hasOwnProperty(p) && normalizedProps[p]) {
                var propArray = p.split('.');
                var ref = resource;
                for (var pa = 0; pa < propArray.length; pa++) {
                    var key = propArray[pa];
                    if (pa == propArray.length - 1) {
                        ref[key] = normalizedProps[p];
                    } else {
                        ref = ref[key] = ref[key] || {};
                    }
                }
            };
        }
        return resource;
    }

    function removeEmptyParameters(params) {
        for (var p in params) {
            if (!params[p] || params[p] == 'undefined') {
                delete params[p];
            }
        }
        return params;
    };

    return {
        createSearchRequest: function (auth, query) {
            requestGenerator = {
                'params': {
                    'maxResults': '1',
                    'part': 'snippet',
                    'fields': 'items(id(videoId),snippet(title))',
                    'q': query,
                    'type': ''
                }
            };
            var parameters = removeEmptyParameters(requestGenerator['params']);
            parameters['auth'] = auth;
            return requestGenerator.params;
        },
        createPlaylistInsertRequest: function (auth, videoId) {
            var requestData = {
                'params':
                  {
                    'part': 'snippet',
                    'onBehalfOfContentOwner': ''
                  },
                'properties':
                  {
                      //default - PLy8mnn_ZmevJTla_ergu5PXy5N3HNSmTB
                      //PLy8mnn_ZmevK88sI5uVFfk1OfNOWt5YyQ
                    'snippet.playlistId': 'PLy8mnn_ZmevK88sI5uVFfk1OfNOWt5YyQ',
                    'snippet.resourceId.kind': 'youtube#video',
                    'snippet.resourceId.videoId': videoId,
                    'snippet.position': ''
                  }
              }
              var parameters = removeEmptyParameters(requestData['params']);
              parameters['auth'] = auth;
              parameters['resource'] = createResource(requestData['properties']);
              return parameters;
        },
    };
})();

module.exports = requestGenerator;