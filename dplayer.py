import web
import mplayer 
import douban

render = web.template.render('templates/', cache=False)

urls = (
         	'/play/(\d+)','Play',
         	'/quit','Quit',
         '/pause','Pause',
        )

app = web.application(urls, globals())

doubanFM = douban.DoubanFM()
doubanFM.login("huangzhe1218@sina.com","67644594")

player = None


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