import httplib
import json
import os
import sys
import subprocess
import time
import requests



class DoubanFM():
    def __init__(self):
        self.logined = False
        self.history = []
        self.song_list = []
        self.channel = 1
        self.cur_song = {'sid':''}

    def login(self,email,passwd):
        payload={'email':email,'password':passwd,'app_name':'radio_desktop_win','version':100}
        url = 'http://www.douban.com/j/app/login'
        r = requests.post(url, data=payload)
        data = r.json()
        if data['err']!='ok':
            print('login failed')
            return False
        self.user_id = data['user_id']
        self.expire = data['expire']
        self.token = data['token']
        self.logined = True
        return True
    def changeChannel(self,channel):
        self.channel = channel
    def playSong(self):
        if len(self.song_list) < 2:
            self.song_list.extend(self.getSongList(self.channel))
        song = self.song_list.pop(0)
        self.history.append(song)
        if len(self.history) > 15:
            self.history.pop(0)
        self.cur_song = song
        return song
    def getParams(self,channel):
        type = 'n'
        h = ''
        if len(self.history)>0:
            type = 'p'
            h = '|'+':p|'.join([x['sid'] for x in self.history])+':p'
            self.history = []
        if self.logined:
            params = {'app_name':'radio_desktop_win','version':100,'user_id':self.user_id,
                'expire':self.expire,'token':self.token,'type':type,'sid':self.cur_song['sid'],'h':h,'channel':channel}
        else:
            params = {'app_name':'radio_desktop_win','version':100,'type':type,'sid':self.cur_song['sid'],'h':h,'channel':channel}
        return params
    def getSongList(self,channel):
        url = 'http://www.douban.com/j/app/radio/people'
        payload = self.getParams(channel)
        r = requests.get(url,params=payload)
        return r.json()['song']
    def getChannels(self):
        url = 'http://www.douban.com/j/app/radio/channels'
        r = requests.get(url)
        return r.json()['channels']
    def printChannels(self):
        self.channels = ''
        if not self.channels:
            self.channels = self.getChannels()
        for channel in self.channels:
            print('%d\t%s\t%s'%(channel['channel_id'],channel['name'],channel['name_en']))