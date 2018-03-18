.. MagicMirror documentation master file, created by
   sphinx-quickstart on Sun Mar 18 17:40:56 2018.
   You can adapt this file completely to your liking, but it should at least
   contain the root `toctree` directive.

Magic Mirror documentation
=======================================

.. toctree::
   :maxdepth: 2
   :caption: Contents:



.. Indices and tables
.. ==================

.. * :ref:`genindex`
.. * :ref:`modindex`
.. * :ref:`search`

Running the code on a Raspberry Pi
==================================

-  Install the following on the Raspberry Pi:

   -  Flask webserver (sudo pip install flask)
   -  Chromium web browser

-  In the app.js, set your credentials to retrieve weather and calendar
   information:

   -  var cityId=your site ID; //http://openweathermap.org/find
   -  var OWMAppId=‘your openWeatherMap app ID’;
   -  var CLIENT_ID = ‘your google API client ID’;

-  Languages can be changed in app.js (assuming they are supported)
   here:

   -  var langOptions = [‘en’, ‘fr’, ‘sw’];

-  Autostart the web application, the motion detection script and
   chromium in kiosk mode by editing
   ~/.config/lxsession/LXDE-pi/autostart as follows:

::

    @lxpanel --profile LXDE-pi
    @pcmanfm --desktop --profile LXDE-pi
    @xscreensaver -no-splash

    @xset s off
    @xset -dpms
    @xset s noblank
    @sudo /usr/bin/python /home/pi/Programming/mirror/motion/motion.py
    @sudo /usr/bin/python /home/pi/Programming/mirror/webapp/app.py
    @sed -i 's/"exited_cleanly": false/"exited_cleanly": true/' ~/.config/chromium/Default/Preferences
    @sed -i 's/"exit_type": "Crashed"/"exit_type": "None"/' ~/.config/chromium/Default/Preferences
    @chromium-browser --noerrdialogs --kiosk http://localhost:5000 --no-first-run --touch-events=enabled --fast --fast-start --disable-popup-blocking --disable-infobars --disable-session-crashed-bubble --disable-tab-switcher --disable-translate

-  Get more info here to enable the Google calendar API if you wish to
   use it:

   https://developers.google.com/google-apps/calendar/quickstart/js#step_1_enable_the_api_name

Operations
==========

-  If for some reason you get logged off Google, you’ll need to
   authenticate again for which you’ll need to interact with your Pi’s
   GUI. This can be challenging if you don’t have a mouse or keyboard
   connected to it.

   -  Install xrpd on the Pi

   ::

       sudo apt-get install xrdp

   -  Edit ~/.config/lxsession/LXDE-pi/autostart and comment the
      following line (that’s because Chromium only opens in one session
      at a time):

   ::

       @chromium-browser --noerrdialogs --kiosk http://localhost:5000 --no-first-run --touch-events=enabled --fast --fast-start --disable-popup-blocking --disable-infobars --disable-session-crashed-bubble --disable-tab-switcher --disable-translate

   -  Reboot the Pi
   -  From a computer on the same LAN, Remote connect to the Pi’s IP
   -  Enter your user credentials (the keyboard layout can be different)
   -  Open Chromium and go to localhost:5000
   -  Click the login button and enter your google credentials
   -  Log out the remote session
   -  Uncomment the above line in ~/.config/lxsession/LXDE-pi/autostart
      and reboot
