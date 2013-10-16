#!/usr/bin/python2.6
#-*- coding: utf-8 -*-

import web
import modify
import ifconfig
import re
import os
import mplayer 
import douban
import json

urls = (
				 '/', 'Portal',
         '/userapp', 'Userapp',
         '/facerec', 'Facerec',
         '/appstore', 'Appstore',
         '/hotmenu', 'Hotmenu',
         '/groupon', 'Groupon',
         '/weibo', 'Weibo',
          '/douban', 'Douban',
         '/appstat/(\d+)/(\d+)', 'Appstat',
         '/upload', 'Upload',
         '/remote', 'Remote',
         '/check','Check',
          '/login','Login',
		  '/logout','Logout',
          '/router','Router',
          '/office','Office',
         	'/play/(\d+)','Play',
         	'/quit','Quit',
         '/pause','Pause',
		 '/getsongs','Song',
        )


web.config.debug=False
app = web.application(urls, globals())
curdir = os.path.dirname(__file__)
render = web.template.render('templates/', cache=False)
session = web.session.Session(app,web.session.DiskStore(os.path.join(curdir,'sessions')),initializer={'login':0})


doubanFM = douban.DoubanFM()
doubanFM.login("huangzhe1218@sina.com","")

player = None

def logged():
	if session.login==1:
		return True
	else:
		return False

class Logout:
    def GET(self):
		session.login=0;
		raise web.seeother('/login')

class Portal:
    def GET(self):
			raise web.seeother('/userapp')

class Router:
	def GET(self):
		if logged():
			appstore =  web.template.frender('templates/router.html')
			return appstore()
		else :
			raise web.seeother('/login');


class Userapp:
	def GET(self):
		userapp =  web.template.frender('templates/userportal.html')
		ip = web.ctx.ip
		mac=os.popen("sudo arp -an "+ip+"|awk \'{print $4}\'").read()
		if mac is None:
			return "Access Deny"
		return userapp(mac)
		
class Login:
    def GET(self):
		appstore =  web.template.frender('templates/login.html')
		return appstore()

    def POST(self):
		i = web.webapi.rawinput()
		password = i.password
		if password !="admin":	
			raise web.seeother('/login');
		else:		
			session.login = 1
			raise web.seeother('/router');
			
class Appstore:
    def GET(self):
		if logged():	
			appstore =  web.template.frender('templates/appstore.html')
			return appstore()
		else:
			raise web.seeother('/login');

class Hotmenu:
    def GET(self):
			hotmenu =  web.template.frender('templates/hotmenu.html')
			return hotmenu()

class Groupon:
    def GET(self):
			groupon =  web.template.frender('templates/groupon.html')
			return groupon()
			

class Weibo:
    def GET(self):
			weibo =  web.template.frender('templates/weibo.html')
			return weibo()	
					
class Douban:
    def GET(self):
			douban =  web.template.frender('templates/player.html')
			return douban()				
	
class Appstat:
    def GET(self,id,stat):
			id1 = int(id)
			modify.check_app(id1,stat)	
			return 'Success Insert!'
        
class Upload:
	def GET(self):
		upload =  web.template.frender('templates/upload.html')
		return upload()


	def POST(self):
		filedir = '/home/pi/portal3/static/store' # change this to the directory you want to store the file in.
		i = web.webapi.rawinput()
		files = i.myfile
		if not isinstance(files, list):
			files = [files]
		for f in files:
			filepath=f.filename.replace('\\','/') # replaces the windows-style slashes with linux ones.
			filename=filepath.split('/')[-1] # splits the and chooses the last part (the filename with extension)
			fout = open(filedir +'/'+ filename,'w') # creates the file where the uploaded file should be stored
			fout.write(f.file.read()) # writes the uploaded file to the newly created file.
			fout.close() # closes the file, upload complete.
		raise web.seeother('/upload')        


class Facerec:
	def GET(self):
		facerec =  web.template.frender('templates/facerec.html')
		return facerec()


class Office:
	def GET(self):
		office =  web.template.frender('templates/office.html')
		return office()

class Remote:
	def GET(self):
		ifcon = ifconfig.ifconfig('eth0')
		m = re.match(r'\d+', ifcon['netmask'])
		flag = m.group()
		remote =  web.template.frender('templates/remote.html')
		return remote(ifcon,flag)

class Check:
	def POST(self):
		user_data = web.input()
		mac = user_data.mac
		os.system("sudo iptables -t mangle -I internet 1 -m mac --mac-source "+mac+" -j RETURN")
		return "success"		


class Song:
	def POST(self):
		title = {}
		web.header('content-type','text/json')
		title={1:"七つの海を渡る風のように",2:"煌めく瞬间に捕われて",3:"世界が終るまでは",4:"无赖",5:"千千阕歌",6:"阴天",7:"情歌",8:"红豆",9:"i knew i love you",10:"旋木",11:"爱我别走",12:"そばにいるね",13:"我们的歌",14:"TheRose",15:"小情歌",16:"我怀念的",17:"约定",18:"问",19:"爱的代价",20:"真的爱你",21:"恋爱大过天",22:"Better Man"}
		return json.dumps(title)	

class Play:
	def GET(self,id):
		global player
		global doubanFM
		id1 = int(id)
		if id1==0 :
			id1=-3
		doubanFM.changeChannel(id1)
		doubanFM.login("huangzhe1218@sina.com","67644594")

		if player is None or not player.is_alive():
		    player = mplayer.Player()
		song = doubanFM.playSong()
		player.loadfile(song['url'])
		return {'msg': 'play'}

class Pause:
	def GET(self):
		if player and player.is_alive():
			player.pause()
			return {'paused':player.paused}
		else:
			return {'err':'403', 'msg':'player is quit'}
      

class Quit:
	def GET(self):
		global player
		if player and player.is_alive():
		    player.quit()
		    player = None
		return {'msg':'quit'}


		
web.webapi.internalerror = web.debugerror

if __name__ == '__main__':
    app.run()
