[![Build
Status](https://api.travis-ci.org/mozilla-services/mozilla-idp.png?branch=master)](https://travis-ci.org/mozilla-services/mozilla-idp)

# Mozilla IdP

``mozilla-idp`` is a server that implements support for Persona on the
mozilla.com domain.

When deployed, this will allow mozillans with `mozilla.com` or
`mozillafoundation.org` email addresses to authenticate with Persona enabled
websites using their Mozilla (LDAP) password.

## Getting Code to Production

This is the process for getting new code into Production

1. Do features and bug fixes in branches. Create a pull request to have new
   code merged into the `master` branch
1. Create a new release tag with `scripts/create-release.sh`
1. Create an RPM from the tag
1. Create a new staging server based on the new RPM
1. Have QA test to make sure everything is OK
1. *if* tests pass, create new production systems from same version. Otherwise
   go back to step 1. to fix issues.
