loadAPI(19);

host.setShouldFailOnDeprecatedUse(true);
host.defineController("OSC", "OSC-based Live Interactor", "0.1", "7b0dec63-840c-4a22-b710-2936d4a0aed6", "briangrassfield");
var trackCount = 0;

function init() {

   var trackBank = host.createMainTrackBank(16, 0, 0); 

   var osc = host.getOscModule();
  
   var targetHost = "192.168.64.36";
   var sendPort = 9100;
   var receivePort = 8100;
   
   // Add the OSC target
   var target = osc.connectToUdpServer(targetHost, sendPort, osc.createAddressSpace());

   ledSwitch(target, "/led/online", true);
   
   var length = trackBank.getSizeOfBank();
   println("Track bank size: " + length);

   var actualTrackCount = 0;
   for (var i = 0; i < length; i++) {
      println("Checking track " + i);
      var track = trackBank.getItemAt(i);
      track.exists().markInterested();
      track.exists().addValueObserver(function(exists) {
         if (exists) {
            actualTrackCount++;
         }
      });
   }

   host.scheduleTask(function() {
      println("Actual track count: " + actualTrackCount);

      if(actualTrackCount < 16)
      {
         println("Track bank size is less than 16, exiting...");
         return;
      }
      
      var track1 = trackBank.getItemAt(0);
      var track2 = trackBank.getItemAt(1);
      var track3 = trackBank.getItemAt(2);
      var track4 = trackBank.getItemAt(3);
      var track5 = trackBank.getItemAt(4);
      var track6 = trackBank.getItemAt(5);
      var track7 = trackBank.getItemAt(6);
      var track8 = trackBank.getItemAt(7);
      var track9 = trackBank.getItemAt(8);
      var track10 = trackBank.getItemAt(9);
      var track11 = trackBank.getItemAt(10);
      var track12 = trackBank.getItemAt(11);
      var track13 = trackBank.getItemAt(12);
      var track14 = trackBank.getItemAt(13);
      var track15 = trackBank.getItemAt(14);
      var track16 = trackBank.getItemAt(15);

      var masterTrack = host.createMasterTrack(0);

      var receiveSpace = osc.createAddressSpace();
      receiveSpace.setShouldLogMessages(true);
      receiveSpace.registerMethod("/controls/sync", ",f", "Sync function", function (source, message)
      {
         println("Received: " + message.getAddressPattern() + " " + message.getTypeTag() + " " + message.getFloat(0));
         refreshInterface(target, trackBank);
      });
      receiveSpace.registerMethod("/controls/masterfilter", ",f", "Master Filter", function (source, message)
      {
         println("Received: " + message.getAddressPattern() + " " + message.getTypeTag() + " " + message.getFloat(0));
         
         
      });

      receiveSpace.registerDefaultMethod (function (source, message)
      {
         println("Received: " + message.getAddressPattern());
      });
      osc.createUdpServer(receivePort, receiveSpace);
      
      
      track1.mute().addValueObserver(function (isMuted) {
         ledSwitch(target, "/led/track1", !isMuted);
      });

      track2.mute().addValueObserver(function (isMuted) {
         ledSwitch(target, "/led/track2", !isMuted);
      });

      track3.mute().addValueObserver(function (isMuted) {
         ledSwitch(target, "/led/track3", !isMuted);
      });

      track4.mute().addValueObserver(function (isMuted) {
         ledSwitch(target, "/led/track4", !isMuted);
      });
      
      track5.mute().addValueObserver(function (isMuted) {
         ledSwitch(target, "/led/track5", !isMuted);
      });

      track6.mute().addValueObserver(function (isMuted) {
         ledSwitch(target, "/led/track6", !isMuted);
      });

      track7.mute().addValueObserver(function (isMuted) {
         ledSwitch(target, "/led/track7", !isMuted);
      });
      
      track8.mute().addValueObserver(function (isMuted) {
         ledSwitch(target, "/led/track8", !isMuted);
      });
      
      track9.mute().addValueObserver(function (isMuted) {
         ledSwitch(target, "/led/track9", !isMuted);
      });
      
      track10.mute().addValueObserver(function (isMuted) {
         ledSwitch(target, "/led/track10", !isMuted);
      });
      
      track11.mute().addValueObserver(function (isMuted) {
         ledSwitch(target, "/led/track11", !isMuted);
      });
      
      track12.mute().addValueObserver(function (isMuted) {
         ledSwitch(target, "/led/track12", !isMuted);
      });
      
      track13.mute().addValueObserver(function (isMuted) {
         ledSwitch(target, "/led/track13", !isMuted);
      });
      
      track14.mute().addValueObserver(function (isMuted) {
         ledSwitch(target, "/led/track14", !isMuted);
      });
      
      track15.mute().addValueObserver(function (isMuted) {
         ledSwitch(target, "/led/track15", !isMuted);
      });
      
      track16.mute().addValueObserver(function (isMuted) {
         ledSwitch(target, "/led/track16", !isMuted);
      });

      ledSwitch(target, "/led/checked", true);

      // TODO: Perform further initialization here.
      println("OSC-based Live Interactor initialized!");
   }, 1000);

   // Add track observer to restart script when a new track is added
   trackBank.addTrackCountObserver(function(count) {
      if (count > trackCount) {
         trackCount = count;
         println("Track count changed, restarting script...");
         init();
      }
   });

}

function refreshInterface(target, trackBank)
{
   var track1 = trackBank.getItemAt(0);
   var track2 = trackBank.getItemAt(1);
   var track3 = trackBank.getItemAt(2);
   var track4 = trackBank.getItemAt(3);
   var track5 = trackBank.getItemAt(4);
   var track6 = trackBank.getItemAt(5);
   var track7 = trackBank.getItemAt(6);
   var track8 = trackBank.getItemAt(7);
   var track9 = trackBank.getItemAt(8);
   var track10 = trackBank.getItemAt(9);
   var track11 = trackBank.getItemAt(10);
   var track12 = trackBank.getItemAt(11);
   var track13 = trackBank.getItemAt(12);
   var track14 = trackBank.getItemAt(13);
   var track15 = trackBank.getItemAt(14);
   var track16 = trackBank.getItemAt(15);

   ledSwitch(target, "/led/track1", !track1.mute().get());
   ledSwitch(target, "/led/track2", !track2.mute().get());
   ledSwitch(target, "/led/track3", !track3.mute().get());
   ledSwitch(target, "/led/track4", !track4.mute().get());
   ledSwitch(target, "/led/track5", !track5.mute().get());
   ledSwitch(target, "/led/track6", !track6.mute().get());
   ledSwitch(target, "/led/track7", !track7.mute().get());
   ledSwitch(target, "/led/track8", !track8.mute().get());
   ledSwitch(target, "/led/track9", !track9.mute().get());
   ledSwitch(target, "/led/track10", !track10.mute().get());
   ledSwitch(target, "/led/track11", !track11.mute().get());
   ledSwitch(target, "/led/track12", !track12.mute().get());
   ledSwitch(target, "/led/track13", !track13.mute().get());
   ledSwitch(target, "/led/track14", !track14.mute().get());
   ledSwitch(target, "/led/track15", !track15.mute().get());
   ledSwitch(target, "/led/track16", !track16.mute().get());

}

function ledSwitch(target, address, status)
{
   println("Sending: " + address + " " + status);
   target.sendMessage(address, status);
}

function flush() {
   // TODO: Flush any output to your controller here.
}

function exit() {

}