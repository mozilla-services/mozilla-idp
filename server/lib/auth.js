/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const ldap = require('ldapjs');

exports.auth = function (config) {
  if (! config.get('ldap_server_url')) throw "Configuration error, you must specifiy an ldap_server_url";
  if (! config.get('ldap_bind_dn')) throw "Configuration error, you must specifiy a ldap_bind_dn";
  if (! config.get('ldap_bind_password')) throw "Configuration error, you must specifiy a ldap_bind_password";

  return {

    /**
     * Authenticate with the Mozilla LDAP server.
     *
     * @method bind
     * @param {string} email - mozilla.com email address
     * @param {string} password - password to use.
     * @param {function} [callback] - callback to call when complete.  Will be
     * called with one parameter - err.  err will be null if successful, an object
     * otw.
     */
    login: function(email, password, callback) {
      if (email.indexOf('@mozilla.com') === -1) {
        throw "Invalid ASSERTION, authenticating non mozilla.com email address:" + email;
      }
      var client = ldap.createClient({
        url: config.get('ldap_server_url')
      });
      var results = 0;
      client.bind(config.get('ldap_bind_dn'), config.get('ldap_bind_password'), function(err) {
        if (err) {
          console.error('Unable to bind to LDAP to search for DNs' + err.toString());
          return callback(err, false);
        } else {
          client.search('o=com,dc=mozilla', {
            scope: 'sub',
            filter: '(|(mail=' + email + ')(emailAlias=' + email + '))',
            attributes: ['mail']
          }, function (err, res) {
            if (err) {
              console.error('error on search ' + err.toString());
              return callback(err, false);
            }
            res.on('searchEntry', function(entry) {
              bindDN = entry.dn;
              results++;
            });
            res.on('end', function () {
              if (results == 1) {
                client.bind(bindDN, password, function (err) {
                  if (err) {
                    console.warn('Wrong username or password ' + err.toString());
                    callback(err, false);
                  } else {
                    // Successful LDAP authentication
                    callback(null, true);
                  }
                });
              } else {
                callback(null, false);
              }
            });
        });
      }
      });
    },
    basic_auth_decode: function (cred, cb) {
      var pieces = cred.split(' ');
      if (pieces[0] === 'Basic' && pieces.length === 2) {
        var decoded = new Buffer(pieces[1], 'base64').toString('utf8');
        if (decoded.indexOf(':') === -1) {
          cb("Malformed Basic Authorization [" + decoded + "]", null, null);
        } else {
          var parts = decoded.split(':');
          cb(null, parts[0], parts[1]);
        }
      } else {
        cb("Unknown type of Authentication [" + pieces[0] + "]", null, null);
      }
    }
  };
};

