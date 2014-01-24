import socket
import SimpleHTTPServer
import SocketServer
import sys
import re
import subprocess as sub

def show_my_ip ():
    ipconfig = sub.check_output(['ipconfig'])
    ipconfig = ipconfig.decode('cp950').encode('utf8')
    ipconfig = ipconfig.replace('\r\n', '\n')
    ipconfig = ipconfig.replace('\n\n', '\n')

    NIC_name_re = '[^ \n].*'
    IP_re = r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}'
    other_descript_re = ' +.*:.*\n'

    result = re.findall(
        r'^(?P<NAME>[^ \n].*):\n'+
        r'(?:' + other_descript_re + r')*' +
        r' +.*IPv4.*: *('+IP_re+r')\n'+
        r'(?:' + other_descript_re + r')*',
        ipconfig,
        re.MULTILINE
    )
    return dict(result)

PORT = 8000 if len(sys.argv) == 1 else int(sys.argv[1])

Handler = SimpleHTTPServer.SimpleHTTPRequestHandler

httpd = SocketServer.TCPServer(("", PORT), Handler)
ip_str = socket.gethostbyname(socket.gethostname())

print 'Detected IP addresses:\n'
for i,j in show_my_ip().iteritems():
    print i + ':'
    print '   ',j
    print ''

print "Serving at port: %d"%(PORT)
try:
    httpd.serve_forever()
except KeyboardInterrupt:
    print "KeyboardInterrupt detected, exit."
    exit()
