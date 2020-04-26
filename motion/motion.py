#!/usr/bin/env python
 
import sys
import time
import RPi.GPIO as GPIO
import subprocess
 
GPIO.setmode(GPIO.BCM)
SHUTOFF_DELAY = 180  # seconds
PIR_PIN = 17          # Pin 17 on the board
 
def main():
    GPIO.setup(PIR_PIN, GPIO.IN)
    turned_off = False
    last_motion_time = time.time()
 
    while True:
        if GPIO.input(PIR_PIN):
            last_motion_time = time.time()
            sys.stdout.flush()
            if turned_off:
                turned_off = False
                turn_on()
        else:
            if not turned_off and time.time() > (last_motion_time + SHUTOFF_DELAY):
                turned_off = True
                turn_off()
        time.sleep(.1)
 
def turn_on():
    subprocess.call('vcgencmd display_power 1', shell=True)
 
def turn_off():
    subprocess.call('vcgencmd display_power 0', shell=True)
 
if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        GPIO.cleanup()
