nodejs:
  pkgrepo.managed:
    - humanname: NodeJS Repository
    - dist: trusty
    - file: /etc/apt/sources.list.d/nodejs.list
    - name: "deb http://ppa.launchpad.net/chris-lea/node.js/ubuntu trusty main"
    - keyserver: keyserver.ubuntu.com
    - keyid:  C7917B12 

  pkg.installed:
    - require:
      - pkgrepo: nodejs

