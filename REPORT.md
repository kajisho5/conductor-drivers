# 変換の結果

作成：2026-10-17T00:50:07.971Z

| 結果 | 数 | 意味 |
|---|---|---|
| full | 3 | 全部の動作を送れる |
| partial | 22 | 一部の動作を送れる |
| list-only | 15 | 動作の一覧は取れたが、送る内容を作れなかった |
| no-send | 39 | 動作を実行しても何も送らなかった（返事待ち・独自の接続手順など） |
| failed / crashed | 516 | モジュールが起動しなかった |
| license | 2 | ライセンスが再利用を許していないので除外 |
| builtin | 3 | アプリに組み込みの定義がある |
| 合計 | 600 | |

送れる動作：199 / 1128

## 送れなかった理由（動作の数）

- not-run: 238
- error: 142
- no-send: 93
- number-slot: 38
- text-slot: 33
- overlap: 30
- option-breaks-send: 13
- verify-mismatch: 8
- multi-datagram: 7
- too-many-choices: 3
- verify-multi-datagram: 2

## 機器ごと

| モジュール | 名前 | 結果 | 送れる / 全部 | ライセンス |
|---|---|---|---|---|
| PosiStageNet-protocol | PosiStageNet Protocol | failed | 0 / 0 | MIT |
| ableton-osc | Ableton Live | failed | 0 / 0 | MIT |
| adder-avm | Adder AVM | failed | 0 / 0 | MIT |
| adder-infinity-aim | Adder AIM | failed | 0 / 0 | MIT |
| adder-infinity-alif | Adder ALIF | failed | 0 / 0 | MIT |
| adder-infinity100xseries | Adder Infinity 1000R Series / Infinity 2020R Series | failed | 0 / 0 | MIT |
| adder-xdip | Adder XDIP | failed | 0 / 0 | MIT |
| adlerluiz-ytmdesktop | adlerluiz YouTube Music Desktop | failed | 0 / 0 | MIT |
| aetaaudio-codecs | AETA HIFISCOOP 3 / SCOOP 3 / SCOOP 4+ / SCOOPY+ / Scoop5 S / Scoop5 S-IP / Sc… | failed | 0 / 0 | MIT |
| agf-characterworks | AGF Characterworks | failed | 0 / 0 | MIT |
| aimedia-encoder-captions | AI Media AV 610 / HD 1492 / HD 492 | failed | 0 / 0 | MIT |
| aimedia-icap | AI Media iCap Portal | no-send | 0 / 1 | MIT |
| aimedia-lexilive | AI Media Lexi Live | no-send | 0 / 4 | MIT |
| aja-dante-12gam | AJA DANTE 12GAM | failed | 0 / 0 | MIT |
| aja-fs | AJA FS2 / FS4 / FS-HDR | failed | 0 / 0 | MIT |
| aja-helo | AJA HELO | failed | 0 / 0 | MIT |
| aja-kipro | AJA Ki Pro / Ki Pro Ultra | partial | 16 / 21 | MIT |
| aja-kumo | AJA Kumo | failed | 0 / 0 | MIT |
| allenheath-ahm | Allen & Heath AHM | failed | 0 / 0 | MIT |
| allenheath-avantis | Allen & Heath Avantis | failed | 0 / 0 | MIT |
| allenheath-cq | Allen Heath CQ-12T / CQ-18T / CQ-20B | failed | 0 / 0 | MIT |
| allenheath-dlive-ilive | Allen & Heath dLive / ilive | failed | 0 / 0 | MIT |
| allenheath-dlive | Allen & Heath dLive | list-only | 0 / 21 | MIT |
| allenheath-sq | Allen & Heath SQ5 / SQ6 / SQ7 | failed | 0 / 0 | MIT |
| analogway-awj | Analog Way AWJ Protocol Device / LivePremier / Alta 4K / Midra 4K | failed | 0 / 0 | MIT |
| analogway-coreplay | Analog Way CorePlay Solo | failed | 0 / 0 | MIT |
| analogway-livecore | Analog Way LiveCore series | failed | 0 / 0 | MIT |
| analogway-livepremier | Analog Way Aquilon | failed | 0 / 0 | MIT |
| analogway-midra | Analog Way Midra / Eikos2 / Saphyr / Pulse2 / SmartMatriX2 / QuickMatriX / Qu… | failed | 0 / 0 | MIT |
| analogway-picturall | Analog Way Picturall Media Server | failed | 0 / 0 | ISC |
| analogway-pls300 | Analog Way PLS 300 | failed | 0 / 0 | MIT |
| android-tv | Google androidtv | failed | 0 / 0 | MIT |
| anomes-millumin | Anomes Millumin 2 / Millumin 3 / Millumin 4 | failed | 0 / 0 | MIT |
| apc-rackpdu | APC Rack PDU | failed | 0 / 0 | MIT |
| apc-ups | APC UPS | no-send | 0 / 0 | MIT |
| arkaos-mediamaster | ArKaos MediaMaster Remote Player | failed | 0 / 0 | MIT |
| arri-tally | Arri Alexa / Amira | failed | 0 / 0 | MIT |
| aten-matrix | ATEN Matrix | failed | 0 / 0 | MIT |
| atlasied-atmosphere | AtlasIED Atmosphere | failed | 0 / 0 | MIT |
| attend2it-speakertimer | Attend2IT Speakertimer.co.uk | failed | 0 / 0 | MIT |
| audac-mtx | Audac MTX48/88 | failed | 0 / 0 | MIT |
| audinate-dante-ddm | Audinate Dante | failed | 0 / 0 | MIT |
| audinate-dantecontroller | Audinate Dante Controller | failed | 0 / 0 | MIT |
| audiostrom-liveprofessor | Audioström LiveProfessor | failed | 0 / 0 | MIT |
| audiotechnica-ceilingarray | Audio Technica ATND-1061 | failed | 0 / 0 | MIT |
| audiotechnica-digitalmixer | Audio Technica ATDM-0604 / ATDM-0604a / ATDM-1012 | failed | 0 / 0 | MIT |
| audiotechnica-discussionsystem | Audio Technica AT-UC50 / AT-UCIR | failed | 0 / 0 | MIT |
| audiotechnica-esw | Audio Technica Engineered Sound Wireless / ESW | failed | 0 / 0 | MIT |
| audiotechnica-system20 | Audio Technica System 20 PRO | failed | 0 / 0 | MIT |
| audivero-unityintercom-client | Audivero Unity Intercom Client | failed | 0 / 0 | MIT |
| auri-tx2n | Auri TX2N / TX2N-D / D4 / D16 | list-only | 0 / 7 | MIT |
| autodirector-mirusuite | AutoDirector MiruSuite | failed | 0 / 0 | MIT |
| aver-ptz | Aver PTZ | failed | 0 / 0 | MIT |
| avgear-ip410 | AVGear IP410 | failed | 0 / 0 | MIT |
| avmediatools-protimer | AVMediatools ProTimer | failed | 0 / 0 | MIT |
| avocet-landscape | Avocet RT Ltd StreamDeck Interface | failed | 0 / 0 | MIT |
| avolites-titan | Avolites Titan | failed | 0 / 0 | MIT |
| avstumpfl-pixera | AVStumpfl Pixera | failed | 0 / 0 | MIT |
| aws-ec2 | AWS EC2 | failed | 0 / 0 | MIT |
| aws-elementallive | AWS Elemental Live | failed | 0 / 0 | MIT |
| aws-medialive | AWS Elemental MediaLive | failed | 0 / 0 | MIT |
| axeltechnology-cgplus | AxelTech CG Plus | failed | 0 / 0 | MIT |
| axeltechnology-vjpro | AxelTech VJ Pro | failed | 0 / 0 | MIT |
| axeltechnology-xplayout | AxelTech XPlayout | failed | 0 / 0 | MIT |
| axeltechnology-xradio | AxelTech XRadio | failed | 0 / 0 | MIT |
| axeltechnology-youplay | AxelTech YouPlay | failed | 0 / 0 | MIT |
| aximmetry-composer | Aximmetry Composer | failed | 0 / 0 | MIT |
| axis-ptz | axis PTZ Camera | failed | 0 / 0 | MIT |
| ballscore-broadcast | Ball Score Broadcast | failed | 0 / 0 | MIT |
| barco-clickshare | Barco Clickshare | failed | 0 / 0 | MIT |
| barco-dp | Barco DP Projector | failed | 0 / 0 | MIT |
| barco-eventmaster-xml | Barco Event Master xml | failed | 0 / 0 | MIT |
| barco-eventmaster | Barco Event Master | failed | 0 / 0 | MIT |
| barco-pds | Barco PDS | failed | 0 / 0 | MIT |
| barco-pulse | Barco UDX Pulse Projector | failed | 0 / 0 | MIT |
| baserow-baserow | Baserow | failed | 0 / 0 | MIT |
| bbc-raven | BBC Raven | failed | 0 / 0 | MIT |
| beaware-conferencecaptioning | BeAware ConferenceCaptioning | failed | 0 / 0 | MIT |
| behringer-wing | Behringer WING | list-only | 0 / 98 | MIT |
| behringer-x32 | Behringer/Midas X32/M32 | failed | 0 / 0 | MIT |
| behringer-xair | Behringer/Midas XR/MR / XAir / XR12 / XR16 / X18 / XR18 | partial | 35 / 84 | MIT |
| betr-support | Betr Production Betr Support | failed | 0 / 0 | MIT |
| biamp-audia | Biamp Audia / Nexia | failed | 0 / 6 | MIT |
| biamp-tesira | Biamp TesiraFORTE | failed | 0 / 0 | MIT |
| binary-moipcontroller | Binary B-900-MOIP-4K-CTRL | failed | 0 / 0 | MIT |
| binwiederhier-ntfy | Philipp C. Heckel Ntfy | failed | 0 / 0 | MIT |
| birddog-central | BirdDog Central | failed | 0 / 0 | MIT |
| birddog-cloud | BirdDog Cloud | failed | 0 / 0 | MIT |
| birddog-connect | BirdDog Connect | failed | 0 / 0 | MIT |
| birddog-converters | BirdDog Converters | failed | 0 / 0 | MIT |
| birddog-ptz | BirdDog PTZ | failed | 0 / 0 | MIT |
| bitfocus-cloud | Bitfocus Companion Cloud | failed | 0 / 0 | MIT |
| bitfocusas-listener | Bitfocus Listener | failed | 0 / 0 | MIT |
| blackbox-boxilla | Blackbox Boxilla | failed | 0 / 0 | MIT |
| bmd-atem | Blackmagic Design ATEM | builtin | 0 / 47 | MIT |
| bmd-gpi-and-tally-interface | Blackmagic Design GPI and Tally Interface | failed | 0 / 0 | MIT |
| bmd-hyperdeck | Blackmagic Design Hyperdeck | failed | 0 / 0 | MIT |
| bmd-multiview4 | Blackmagic Design Multiview 4 | full | 10 / 10 | MIT |
| bmd-smartview | Blackmagic Design SmartView / SmartScope | no-send | 0 / 11 | MIT |
| bmd-teranex | Blackmagic Design Teranex | failed | 0 / 0 | MIT |
| bmd-ultimatte | Blackmagic Design Ultimatte | failed | 0 / 0 | MIT |
| bmd-videohub | Blackmagic Design Videohub | failed | 0 / 0 | MIT |
| bmd-webpresenter | Blackmagic Design WebPresenter HD / WebPresenter 4K | failed | 0 / 0 | MIT |
| boinx-mimolive | Boinx mimoLive | failed | 0 / 0 | MIT |
| bolin-ptz | Bolin Technology PTZ | no-send | 0 / 8 | MIT |
| bom-api | Bureau of Meteorology API | failed | 0 / 0 | MIT |
| borealis-vor | Borealis Solutions Vor | failed | 0 / 0 | MIT |
| bosch-dicentis | Bosch Dicentis Conference System | failed | 0 / 0 | MIT |
| bosch-hd-cameracontrol | Bosch HD Camera Control | failed | 0 / 0 | MIT |
| boxcast-api | Boxcast API | failed | 0 / 0 | MIT |
| brainstorm-suite | Brainstorm Multimedia Brainstorm Suite | failed | 0 / 0 | MIT |
| broadlink-remote | BroadLink RM4 Pro | failed | 0 / 0 | MIT |
| brompton-tessera | Brompton Technology Tessera LED Processor Control | failed | 0 / 0 | MIT |
| bss-soundweb | BSS Soundweb London | failed | 0 / 0 | MIT |
| bytehive-playoutbee | ByteHive PlayoutBee | failed | 0 / 0 | ISC |
| cablematters-matrix | Cable Matters Matrix | failed | 0 / 3 | MIT |
| cablematters-matrix | Cable Matters Matrix | failed | 0 / 3 | MIT |
| calrec-cscp | Calrec CSCP | failed | 0 / 0 | MIT |
| camstreamer-camstreamer | camstreamer Camera | failed | 0 / 0 | MIT |
| canon-ptz | Canon CR-N300 / CR-N500 / CR-N700 / CR-X300 / CR-X500 / XF605 / C300 MkIII / … | failed | 0 / 0 | MIT |
| canon-xf | Canon XF405 / XF705 / C100 / C200 / Browser Remote | failed | 0 / 0 | MIT |
| captionkit-api | CaptionKit API | failed | 0 / 0 | MIT |
| casparcg-server | CasparCG Server | failed | 0 / 0 | ISC |
| castr-api | castr.io API v2 | failed | 0 / 0 | MIT |
| cedar-dns8d | Cedar DNS 8D | no-send | 0 / 10 | MIT |
| chamsys-magicq-osc | ChamSys MagicQ | partial | 2 / 13 | MIT |
| chamsys-magicq-udp | ChamSys MagicQ (UDP) | failed | 0 / 0 | MIT |
| chamsys-quickq | Chamsys QuickQ | failed | 0 / 0 | MIT |
| chilibytes-pdfosc | ChiliBytes PDFOSC | no-send | 0 / 7 | MIT |
| christie-projector | Christie Projector | failed | 0 / 0 | MIT |
| christie-spyder | Christie Spyder X20/X80 | failed | 0 / 0 | ISC |
| churchapps-freeshow | ChurchApps FreeShow | failed | 0 / 0 | MIT |
| chyronhego-lyric | ChyronHego Lyric | failed | 0 / 0 | MIT |
| cinegy-capture | Cinegy Capture | failed | 0 / 0 | MIT |
| cisco-roomos | Cisco RoomOS | failed | 0 / 0 | MIT |
| classx-mixboard | ClassX MixBoard | failed | 0 / 0 | MIT |
| clearcom-station-ic | Clear-Com Station-IC | no-send | 0 / 6 | MIT |
| cockos-reaper | Cockos REAPER | failed | 0 / 0 | MIT |
| coda-linus | CODA Audio LINUS6.4 | failed | 0 / 0 | MIT |
| colorlight-grandshow | Colorlight GrandShow | failed | 0 / 0 | MIT |
| colorlight-processor | Colorlight U-Series / Z-Series / X-Series / V-Series / VX-Series / D-Series /… | failed | 0 / 0 | MIT |
| combitech-vidblasterx | CombiTech VidBlasterX | failed | 0 / 0 | MIT |
| companion-satellite | Bitfocus Companion Satellite API | failed | 0 / 0 | MIT |
| creativeland-capacitimer | Creativeland Capacitimer | failed | 0 / 0 | MIT |
| creativeland-mediacontrolbridge | Creativeland Media Control Bridge | failed | 0 / 0 | MIT |
| crestron-digitalmatrix | Crestron DigitalMedia Switcher | failed | 0 / 0 | MIT |
| crestron-hd-mdnxm-4kz-e | Crestron HD-MD4X1-4KZ-E / HD-MD4X2-4KZ-E / HD-MD8X8-4KZ-E | no-send | 0 / 0 | MIT |
| cuemanager-cuesheetconnector | Cue Manager Cue Sheet Connector | failed | 0 / 0 | MIT |
| cvmeventi-countdown | CVM Eventi Countdown | failed | 0 / 0 | MIT |
| cyberpower-pdu | CyberPower PDU | failed | 0 / 0 | MIT |
| dahuasecurity-ptz | dahua PTZ Camera | failed | 0 / 0 | MIT |
| dan-dugan-automixer | Dan Dugan Sound Design Model M / Model N | failed | 0 / 0 | MIT |
| dashare-multiplay | da-share MultiPlay | failed | 0 / 0 | MIT |
| dashare-multiplay3 | da-Share MultiPlay 3 | failed | 0 / 0 | MIT |
| dataton-watchout-json | Dataton Watchout 7 | failed | 0 / 0 | MIT |
| dataton-watchout | Dataton Watchout | failed | 0 / 0 | MIT |
| dbaudiotechnik-amps | d&b audiotechnik 5D / 10D / 30D / 40D / D20 / D40 / D80 | no-send | 0 / 16 | MIT |
| dbaudiotechnik-dsp | D&B Audiotechnik DS100 | failed | 0 / 0 | MIT |
| dcc-ex-commandstation | DCC-EX | failed | 0 / 0 | MIT |
| denon-receiver | Denon AVR | failed | 0 / 0 | MIT |
| denon-recorder | Denon DN-900R / DN-700R / DN-500R / DN-F650R / DN-F450R | partial | 6 / 7 | MIT |
| depili-clock-8001 | Depili Clock-8001 | failed | 0 / 0 | MIT |
| devantech-ds | Devantech DSXXX | failed | 0 / 0 | MIT |
| devcore-mixingstation | Mixing Station GmbH Mixing Station | failed | 0 / 0 | MIT |
| dhdaudio-control-api | DHD Control API | failed | 0 / 0 | MIT |
| dhdaudio-ecp | DHD Audio Series 52 / RM4200D / XD2 / XC2 / SX2 | failed | 0 / 0 | MIT |
| digitalprojection-projectors | DigitalProjection Models supported by Projector Controller II | failed | 0 / 0 | MIT |
| directout-audioprocessors | DirectOut technologies PRODIGY.MC / PRODIGY.MP / PRODIGY.MX / MAVEN.A | failed | 0 / 0 | MIT |
| discord-api | Discord API | failed | 0 / 0 | MIT |
| disguise-liveupdate | Disguise LiveUpdate | no-send | 0 / 4 | MIT |
| disguise-mtc | Disguise - Multi Transport Control | failed | 0 / 0 | MIT |
| disguise-osc | Disguise OSC | failed | 0 / 0 | MIT |
| disguise-smc | Disguise - SMC | failed | 0 / 0 | MIT |
| dmxcontrolprojects-dmxcontrol3 | DMXControl Projects e.V. DMXControl 3 | failed | 0 / 0 | MIT |
| dolby-cinemaprocessor | Dolby Cinema Processor | failed | 0 / 0 | MIT |
| dtvideolabs-playbackproplus | DT Videolabs PlaybackPro Plus | failed | 0 / 0 | MIT |
| easyrecord-cgcontrol | Easyrecord CG control | failed | 0 / 0 | MIT |
| eaton-epdu | Eaton ePDU | no-send | 0 / 5 | MIT |
| ecamm-live | ecamm Live | failed | 0 / 0 | MIT |
| elgato-keylight | Elgato Key Light / Ring Light | list-only | 0 / 6 | MIT |
| emotimo-st4 | eMotimo ST4 / ST4.3 / SA2.6 | failed | 0 / 0 | MIT |
| epiphan-pearl | Epiphan Pearl | failed | 0 / 0 | MIT |
| epson-businesspj | Epson Business Projectors | failed | 0 / 0 | MIT |
| equipson-lightshark | LightShark LS1 / LS-Core | failed | 0 / 0 | MIT |
| ereca-stageracer | Ereca Stage Racer II | failed | 0 / 0 | MIT |
| esphome-api | ESPHome API | failed | 0 / 0 | MIT |
| etc-echo | ETC Echo Integration Interface | failed | 0 / 0 | MIT |
| etc-eos | ETC EOS | failed | 0 / 0 | MIT |
| etc-paradigm | ETC Paradigm | failed | 0 / 0 | MIT |
| etcaudiovisuel-onlyview | ETC Audiovisuel Onlyview | failed | 0 / 0 | MIT |
| etl-rfmatrix | ETL Systems ETL RF Matrix | failed | 0 / 0 | MIT |
| evertz-quartz | Evertz EQX Router / EQT Router | failed | 0 / 0 | MIT |
| evertz-symphony | Evertz MVP / VIP / NGI / Exhibit | failed | 0 / 0 | MIT |
| evertz-vipx | Evertz Vipx | list-only | 0 / 7 | MIT |
| evision-hd102 | Evision HD102 | failed | 0 / 0 | MIT |
| extron-mmx-tcp | Extron MMX 42/62 Series | failed | 0 / 0 | MIT |
| extron-smp351 | Extron SMP 351 | failed | 0 / 0 | MIT |
| eyevinn-intercom | Eyevinn Open Intercom | failed | 0 / 0 | MIT |
| ezcoo-matrix | EZCOO MX44-HAS2 4x4 HDMI Matrix / MX42HS 4x2 HDMI Matrix | failed | 0 / 0 | MIT |
| figure53-go-button | Figure 53 GoButton with feedback | failed | 0 / 0 | MIT |
| figure53-qlab-advance | Figure 53 QLab with feedback | failed | 0 / 0 | MIT |
| figure53-qview | Figure 53 QView | failed | 0 / 0 | MIT |
| fivem-console | FiveM Console | failed | 0 / 0 | MIT |
| focusrite-mp8r | Focusrite MP8R | failed | 0 / 0 | MIT |
| foobar2000-foobar2000 | foobar2000 | failed | 0 / 0 | MIT |
| fora-mfr | For.A MFR | failed | 0 / 0 | MIT |
| foscam-ptz | foscam PTZ Camera | failed | 0 / 0 | MIT |
| fulldomepro-server | Fulldome.pro Projection Server | failed | 0 / 0 | MIT |
| gdsys-muxkvmswitch | Guntermann&Drunck DL-DVI-MUX4 | failed | 0 / 0 | MIT |
| generic-artnet | Art-Net | failed | 0 / 0 | MIT |
| generic-blink | Button Blinker | failed | 0 / 0 | MIT |
| generic-bridge | Bridge | failed | 0 / 0 | MIT |
| generic-dataentry | Data Entry | failed | 0 / 0 | MIT |
| generic-emberplus | Ember+ | failed | 0 / 0 | MIT |
| generic-filereader | File Reader | failed | 0 / 0 | MIT |
| generic-http | HTTP Requests | failed | 0 / 0 | MIT |
| generic-ical | iCal Scheduler | no-send | 0 / 2 | MIT |
| generic-midi | MIDI | failed | 0 / 0 | MIT |
| generic-modbus | Modbus | failed | 0 / 0 | MIT |
| generic-mqtt | MQTT | failed | 0 / 0 | MIT |
| generic-mysql | MySQL / MariaDB | failed | 0 / 0 | MIT |
| generic-onvif | ONVIF | failed | 0 / 0 | MIT |
| generic-osc | OSC | no-send | 0 / 8 | MIT |
| generic-ping | Ping | failed | 0 / 0 | MIT |
| generic-pingandwake | Ping and Wake | failed | 0 / 0 | MIT |
| generic-pjlink | JBMIA Projector / PJLink | failed | 0 / 0 | MIT |
| generic-ptpv2-client | PTP v2 | failed | 0 / 0 | MIT |
| generic-rss-client | RSS | failed | 0 / 0 | MIT |
| generic-sacn | Streaming ACN | failed | 0 / 0 | MIT |
| generic-smtp | SMTP | no-send | 0 / 1 | MIT |
| generic-snmp | SNMP Requests | no-send | 0 / 6 | ISC |
| generic-speedtest | Speedtest | failed | 0 / 0 | MIT |
| generic-ssh | SSH | failed | 0 / 0 | MIT |
| generic-stopwatch | Stopwatch | failed | 0 / 0 | MIT |
| generic-swp02 | SW-P-02 / Probel Router SW P 02 / Snell Router SW P 02 | failed | 0 / 0 | MIT |
| generic-swp08 | SW-P-08 / Ross Router / Snell ProBel Router / Grass Valley Router / Lawo VSM … | partial | 2 / 14 | MIT |
| generic-syslog-client | Syslog Client | list-only | 0 / 1 | MIT |
| generic-tcp-serial | TCP Serial Port | failed | 0 / 0 | MIT |
| generic-tcp-udp | TCP and UDP Requests | partial | 1 / 2 | MIT |
| generic-timezone | Timezone | failed | 0 / 0 | MIT |
| generic-wakeonlan | Wake-on-LAN | failed | 0 / 0 | MIT |
| generic-websocket | WebSocket | failed | 0 / 0 | MIT |
| generic-webtable | Web-Table | failed | 0 / 0 | MIT |
| getontime-ontime | GetOntime Ontime | no-send | 0 / 0 | MIT |
| glensound-divine | Glensound Divine | failed | 0 / 0 | MIT |
| glensound-minferno | Glensound Minferno | failed | 0 / 0 | MIT |
| globalcache-itac-cc | Global Cache iTach IP2CC | failed | 0 / 0 | MIT |
| globalcache-itac-ir | Global Cache iTach IP2IR | failed | 0 / 0 | MIT |
| globalcache-itac-sl | Global Cache iTach IP2SL | failed | 0 / 0 | MIT |
| gnuralnet-livetoair | Gnural Net Live To Air | failed | 0 / 0 | MIT |
| google-sheets | Google Sheets | failed | 0 / 0 | MIT |
| govee-lights | Govee Lights | failed | 0 / 0 | MIT |
| grassvalley-amp | Grass Valley AMP | no-send | 0 / 9 | MIT |
| grassvalley-kframe | GrassValley K-Frame | failed | 0 / 0 | MIT |
| greengo-intercom | Green-GO Intercom Remote (OSC) | failed | 0 / 0 | MIT |
| greenhippo-hippotizer-rest | Green Hippo Hippotizer | failed | 0 / 0 | MIT |
| gudesystems-smartpdu | Gude Systems Smart PDU | failed | 0 / 0 | MIT |
| h2r-graphics | Here to Record H2R Graphics | partial | 11 / 46 | MIT |
| h2r-layouts | Here to Record H2R Layouts | failed | 0 / 0 | MIT |
| haivision-connectdvr | Haivision Connect DVR | failed | 0 / 0 | MIT |
| haivision-kbencoder | Haivision KB Encoder | failed | 0 / 0 | MIT |
| hdkatov-visca | HDkatov VISCA | failed | 0 / 0 | MIT |
| hdtv-wolfpackgreen | HDTV WolfPackGreen HDMI Matrix | failed | 0 / 0 | MIT |
| highend-hog4 | High End Systems Hog 4 | failed | 0 / 0 | MIT |
| highpass-accompaniment | HighPass AcCompaniment | no-send | 0 / 7 | MIT |
| highpass-countdown | Highpass Countdown | failed | 0 / 0 | MIT |
| highpass-upc | HighPass UPC -Ultimate Presentation Control | failed | 0 / 0 | MIT |
| hive-beebox | Hive Beeblade / Beebox | failed | 0 / 0 | MIT |
| hollyland-solidcom | Hollyland Solidcom | failed | 0 / 0 | MIT |
| hologfx-holographics | hologfx.io Holographics | failed | 0 / 0 | MIT |
| homeassistant-server | Home Assistant Server | failed | 0 / 0 | MIT |
| ibm-watson | IBM Watson | failed | 0 / 0 | MIT |
| iccms-sib | IC Control Media & Sport AB Sport In The Box | failed | 0 / 0 | MIT |
| ictag-easyvideo | ICT AG easyVideo | partial | 5 / 8 | MIT |
| idk-fdx | IDK FDX-S | failed | 0 / 0 | MIT |
| idk-msd | IDK MSD-V4 / MSD-V6 | failed | 0 / 0 | MIT |
| idk-ninjar | IDK NINJAR | failed | 0 / 0 | MIT |
| iiyama-prolite | Iiyama Prolite | failed | 0 / 0 | MIT |
| imagine-lrc | Imagine Communications Logical Router Control | partial | 3 / 12 | MIT |
| imimot-mitti | Imimot Mitti | failed | 0 / 0 | MIT |
| influxdb-apiv2 | InfluxDB v2 | failed | 0 / 0 | MIT |
| innosonix-maxx | Innosonix Maxx | failed | 0 / 0 | MIT |
| intelix-matrix | Intelix INT-44HDX / INT-66HDX / INT-88HDX | failed | 0 / 0 | MIT |
| interactivetechnologies-cueserver | Interactive Technologies CueServer | failed | 0 / 0 | MIT |
| interspace-cueether | Interspace Industries CueEther | failed | 0 / 0 | MIT |
| interspace-mastercuev7 | Interspace Industries MasterCue V7 | list-only | 0 / 10 | MIT |
| iobroker-ws | ioBroker WebSockets | no-send | 0 / 5 | MIT |
| ioversal-vertex | ioversal Vertex | failed | 0 / 0 | MIT |
| ipl-ocp | Inkling Performance Labs Overlay Control Panel | failed | 0 / 0 | MIT |
| irisdown-countdowntimer | Irisdown Countdown Timer | failed | 0 / 0 | MIT |
| irisdown-remoteshowcontrol | Irisdown Remote Show Control | failed | 0 / 0 | MIT |
| josephadams-gamepadio | Joseph Adams gamepad-io | failed | 0 / 0 | MIT |
| josephadams-scriptlauncher | Joseph Adams Script Launcher | failed | 0 / 0 | MIT |
| joy-playdeck | JOY event & media Playdeck | failed | 0 / 0 | MIT |
| jozeemedia-jcounter | Jozee Media Solutions J-Counter | failed | 0 / 0 | MIT |
| julusian-test | Julusian Test | failed | 0 / 0 | MIT |
| justmacros-lua | JustMacros LUA | failed | 0 / 0 | MIT |
| jvc-ptz | JVC Camera / KZ100 / PZ510 | failed | 0 / 0 | MIT |
| kenku-fm | KenkuFM API Controller | failed | 0 / 0 | MIT |
| kiloview-encoder | Kiloview E1 / E2 / E3 / G1 / G2 | failed | 0 / 0 | MIT |
| kiloview-ndi | Kiloview N40 / N50 / N60 / N5 / N6 | no-send | 0 / 11 | MIT |
| kissbox-gpio | KISSBOX IO3CC / IO8CC | failed | 0 / 0 | MIT |
| klang-app | Klang App | failed | 0 / 0 | MIT |
| klang-immersive | Klang Immersive / Konductor / Vokal / DMI-Klang | failed | 0 / 0 | MIT |
| klvr-chargerpro | KLVR Charger Pro | failed | 0 / 0 | MIT |
| kommander-t3 | BowTek Kommander T0/T1/T3 / F1/F1Pro/F2/F9 / PS-Series | failed | 0 / 0 | MIT |
| kramer-matrix | Kramer Matrix (Generic) | failed | 0 / 0 | MIT |
| kxwell-ptz | KXWell PTZ Camera | partial | 11 / 19 | MIT |
| lea-amplifier | LEA Amplifier | failed | 0 / 0 | MIT |
| leolabs-ableset | Leolabs AbleSet | failed | 0 / 0 | MIT |
| leonreucher-vstopowerpoint | Leon Reucher PowerPoint Remote VSTO WebSocket | failed | 0 / 0 | MIT |
| lgtv-display | LG Electronics LG Display | failed | 0 / 0 | MIT |
| lgtv-prodisplay | LG Pro Display | failed | 0 / 0 | MIT |
| libreoffice-impress | LibreOffice Impress | failed | 0 / 0 | MIT |
| lightware-lw2 | Lightware LW2 | failed | 0 / 0 | MIT |
| lightware-lw3 | Lightware LW3 | failed | 0 / 0 | MIT |
| lilliput-monitor | Lilliput Monitor / Q18 | list-only | 0 / 5 | MIT |
| limagiran-holyrics | Lima Giran Ltda. Holyrics | failed | 0 / 0 | MIT |
| lofas-ndistudioclock | Lofas AB NDI Studio Clock | failed | 0 / 0 | MIT |
| logos-proclaim | Logos Proclaim | failed | 0 / 0 | MIT |
| lost-cause-photographic-controlroom | Lost Cause Photographic ControlRoom | failed | 0 / 0 | MIT |
| ltn-schedule | LTN Schedule | failed | 0 / 0 | MIT |
| luminex-gigacore | Luminex GigaCore | partial | 1 / 12 | MIT |
| luminex-luminode | Luminex LumiNode / LumiCore | partial | 6 / 12 | MIT |
| lutron-caseta | Lutron Caseta | no-send | 0 / 0 | MIT |
| lyntec-rpc-breaker | LynTec RPC | failed | 0 / 0 | MIT |
| madrix-aura | Madrix Aura 2/8/12/32 | list-only | 0 / 8 | MIT |
| magewell-director | Magewell Director Mini | failed | 0 / 0 | MIT |
| magewell-proconvert-decoder | Magewell Pro Convert Decoder | failed | 0 / 0 | MIT |
| magewell-ultrastream | Magewell Ultra Stream HDMI / Ultra Stream SDI / Ultra Encode HDMI / Ultra Enc… | failed | 0 / 0 | MIT |
| magnimage-mig-ec | Magnimage MIG-EC90 / MIG-EC80 | failed | 0 / 0 | MIT |
| malighting-grandma2 | MA Lighting GrandMA2 | partial | 1 / 5 | MIT |
| malighting-grandma3 | MA Lighting GrandMA3 | no-send | 0 / 15 | MIT |
| malighting-msc | MA Lighting dot2 MSC / grandMA2 MSC | failed | 0 / 0 | MIT |
| marshall-ipcamera | Marshall CV355 / CV420 / CV420e / CV620 / CV630 / CV730 | failed | 0 / 0 | MIT |
| massimo-callegari-qlcplus | massimo-callegari qlcplus / qlc+ | failed | 0 / 0 | MIT |
| matrox-conductip | Matrox ConductIP | no-send | 0 / 1 | MIT |
| matrox-monarch | Matrox Monarch HD/HDX/LCS | failed | 0 / 0 | MIT |
| meld-studio | Meld Studio | failed | 0 / 0 | MIT |
| metus-player | Metus Technology Player Controller | failed | 0 / 0 | MIT |
| microsoft-teams | Microsoft Teams | failed | 0 / 0 | MIT |
| microsoft-vscode | Microsoft VSCode | failed | 0 / 0 | MIT |
| middleman-adit | Middleman Software AdIT | failed | 0 / 0 | MIT |
| middleman-breaktime | Middleman Software BreakTime | failed | 0 / 0 | MIT |
| middleman-scte104proxy | Middleman Software SCTE 104 Proxy | failed | 0 / 0 | MIT |
| middlethings-middlecontrol | Middle Things Middle Control | failed | 0 / 0 | MIT |
| mixtech-theatremix | Mixing Technology TheatreMix | failed | 0 / 0 | MIT |
| modulopi-moduloplayer | Modulo Pi Modulo Player | failed | 0 / 0 | MIT |
| monnit-sensors | Monnit Sensors | failed | 0 / 0 | MIT |
| monospace-lightkey | Monospace Lightkey | failed | 0 / 0 | MIT |
| monteiro-cronosdown | Monteiro CronosDown | failed | 0 / 0 | MIT |
| monteiro-pptvideo | Monteiro PPT-VIDEO | failed | 0 / 0 | MIT |
| moxa-e2200series | Moxa e2210 / e2212 / e2214 / e2242 / e2260 / e2262 | failed | 0 / 0 | MIT |
| mrmoco-mhc | Mark Roberts Motion Control MHC | failed | 0 / 0 | MIT |
| mt-viki-matrix | MT VIKI MT-HD0808 8x8 HDMI Matrix | failed | 0 / 0 | MIT |
| multicam-systems-rcp | Multicam Systems RCP | failed | 0 / 0 | MIT |
| mvr-helios | Megapixel Helios | failed | 0 / 0 | MIT |
| nanoleaf-shapes | Nanoleaf Shapes / Aurora / Canvas / Elements | failed | 0 / 0 | MIT |
| nec-display | NEC Display | failed | 0 / 0 | MIT |
| neodarque-stagetimer2 | Neodarque StageTimer2 | failed | 0 / 0 | MIT |
| netgear-avline | Netgear AV Line | failed | 0 / 0 | MIT |
| netio-powerbox | NETIO PowerBOX | failed | 0 / 0 | MIT |
| netron-en | Netron EN / EN-12 | failed | 0 / 0 | MIT |
| neumannmueller-stageflow | Neumann&Müller GmbH & Co. KG Stageflow | failed | 0 / 0 | MIT |
| neutrik-dpro | Neutrik NA-2-IO-DPRO | failed | 0 / 0 | MIT |
| nevion-mrp | Nevion MRP / Multicon | failed | 0 / 0 | MIT |
| nevion-videoipath | Nevion VideoIPath | no-send | 0 / 0 | MIT |
| newblue-captivate | NewBlue Captivate | failed | 0 / 0 | MIT |
| newtek-tricaster | Newtek Tricaster | failed | 0 / 0 | MIT |
| nexo-nxamp | NEXO NXAMP | failed | 0 / 0 | MIT |
| nohassleav-matrix | NoHassleAV Matrix | failed | 0 / 0 | MIT |
| nohassleav-videowallprocessor | NoHassleAV HDP MXB44VW / Video Wall Processor 4x4 | failed | 0 / 0 | MIT |
| noiseproductions-vvd | Noise Productions Virtual Video Director | failed | 0 / 6 | MIT |
| noismada-octopusshowcontrol | Octopus Listener | failed | 0 / 0 | MIT |
| nortek-bluebolt | Nortek Bluebolt | partial | 2 / 6 | MIT |
| notion-timestamp | Notion Timestamp | failed | 0 / 0 | MIT |
| novastar-coex | NovaStar Coex MX40 Pro / CX80 Pro / KU20 | failed | 0 / 0 | MIT |
| novastar-controller | Novastar MCTRL4K / VX4S / VX6S / NovaPro HD / NovaPro UHD Jr / VX1000 / VX600… | failed | 0 / 0 | MIT |
| novastar-mediaserver | Novastar RX6 / FX3 Pro | failed | 0 / 0 | MIT |
| novastar-mxreal3 | NovaStar MxReal 3 | failed | 0 / 0 | MIT |
| novastar-splicer | Novastar Splicer | failed | 0 / 0 | MIT |
| novastar-switcher | NovaStar N10 / N20 / D12 / D32 | failed | 0 / 0 | MIT |
| nrk-sofie-chef | NRK Sofie Chef | failed | 0 / 0 | MIT |
| ntp-technology-dot | NTP Technology 635-800A / 600 Series / Penta Series | failed | 0 / 0 | MIT |
| nws-api | National Weather Service Weather Alerts | failed | 0 / 0 | MIT |
| obs-studio | OBS Studio | failed | 0 / 0 | MIT |
| obsbot-osc | OBSBOT Center App / Tail 2 / Tail Air / Tiny / Tiny 4K / Tiny 2 / Tiny 2 Lite… | partial | 28 / 31 | MIT |
| obsidiancontrol-onyx-osc | Obsidian Control Systems ONYX | failed | 0 / 0 | MIT |
| odyssey-insight | Odyssey Development Insight | partial | 6 / 7 | MIT |
| openrgb-sdk | OpenRGB | failed | 0 / 0 | MIT |
| openweather-rest | OpenWeather Current Weather API | failed | 0 / 0 | MIT |
| optimalaudio-zone | Optimal Audio Zone | failed | 0 / 0 | MIT |
| osctimer-osctimer | O:S:C Timer | failed | 0 / 0 | MIT |
| osee-gostream-series | OSEE GoStream_Series | failed | 0 / 0 | MIT |
| osee-gostream | OSEE GoStream | failed | 0 / 0 | MIT |
| panasonic-av-hs6000 | panasonic AV-HS6000 | failed | 0 / 0 | MIT |
| panasonic-av-hsw10 | Panasonic AV-HSW10 | failed | 0 / 0 | MIT |
| panasonic-avhs | Panasonic AV-HS50 / AV-HS410 / AV-UHS500 | failed | 0 / 0 | MIT |
| panasonic-camera-controller | Panasonic Remote Camera Controller | failed | 0 / 0 | MIT |
| panasonic-cameras | Panasonic Camera | failed | 0 / 0 | MIT |
| panasonic-kairos | Panasonic Kairos | failed | 0 / 0 | MIT |
| panasonic-p2 | Panasonic P2 / CX350 / HC-X2 / HC-X20 | failed | 0 / 0 | MIT |
| panasonic-projector | Panasonic Projector | failed | 0 / 0 | MIT |
| panasonic-ptz | Panasonic PTZ Camera | failed | 0 / 0 | MIT |
| panasonic-tv-th | Panasonic TH-84EF1U / TH-75EF1U / TH-85EF1W / TH-75EF1W / TH-98SQ2HW / TH-86E… | failed | 0 / 0 | MIT |
| pastebin-api | Pastebin API | no-send | 0 / 4 | MIT |
| peavy-ratc | Peavy NION n3 / NION n6 / NION nE / NION nX | failed | 0 / 0 | MIT |
| phabrix-qx | Phabrix QX12G | failed | 0 / 0 | MIT |
| pharos-designer | Pharos Designer Controller | failed | 0 / 0 | MIT |
| philips-hue | Philips Hue | failed | 0 / 0 | MIT |
| philips-sicp | Philips SICProtocol | failed | 0 / 0 | MIT |
| philips-wiz-bulbs | Philips Wiz Bulbs | failed | 0 / 0 | MIT |
| pixap-pixtimerpro | piXap piXtimer Pro | failed | 0 / 0 | MIT |
| pixelhue-mediaserver | Pixelhue MS3 / MS3 Pro | failed | 0 / 0 | MIT |
| pixelhue-switcher | Pixelhue P10 / P20 / Q8 / P80 | failed | 0 / 0 | MIT |
| planningcenter-serviceslive | Planning Center Online Services Live | failed | 0 / 0 | MIT |
| pnh-opencountdown | [Project-Name-Here] opencountdown | license | 0 / 0 | LGPL-3.0 |
| pnh-soundr | [Project-Name-Here] Soundr | license | 0 / 0 | LGPL-3.0 |
| polecam-autopod | Polecam Autopod+ / Panapod | failed | 0 / 0 | MIT |
| powersoft-amplifiers | Powersoft Amplifier | failed | 0 / 0 | MIT |
| presentationtools-aps | PresentationTools Auto Presentation Switcher | failed | 0 / 0 | MIT |
| presentationtools-cuetimer | PresentationTools CueTimer | failed | 0 / 0 | MIT |
| ptzoptics-superjoy | PTZ Optics SuperJoy | failed | 0 / 0 | MIT |
| ptzoptics-visca | PTZoptics VISCA | failed | 0 / 0 | MIT |
| purelink-pt-ma-hd44m | purelink PT-MA-HD44M | failed | 0 / 0 | MIT |
| pushover-api | Pushover | failed | 0 / 0 | MIT |
| pynch-nexa | Pynch Nexa / EVS / XT / XS / LSM / Hyperdeck | failed | 0 / 0 | MIT |
| qsys-remote-control | Q-Sys | no-send | 0 / 25 | MIT |
| radiodj-rest | RadioDJ REST API | failed | 0 / 0 | MIT |
| raspberry-gpio | Raspberry Pi foundation RPi GPIO | failed | 0 / 0 | MIT |
| rationalacoustics-smaart3 | Rational Acoustics Smaart V8.3 - V8.5 / Smaart Di 2.1 and newer | no-send | 0 / 32 | MIT |
| red-rcp2 | RED RCP2 Camera Control | failed | 0 / 0 | MIT |
| renewedvision-propresenter-api | Renewed Vision ProPresenter API | failed | 0 / 0 | MIT |
| renewedvision-propresenter | Renewed Vision ProPresenter | failed | 0 / 0 | MIT |
| renewedvision-pvp | Renewed Vision PVP 3 | failed | 0 / 0 | MIT |
| resi-decoders | Resi Decoder | failed | 0 / 0 | MIT |
| resi-studio | Resi Studio | failed | 0 / 0 | MIT |
| resolume-arena | Resolume Arena | failed | 0 / 0 | MIT |
| restream-api | Restream API | failed | 0 / 0 | MIT |
| rgblink-mini | RGBlink mini/mini+ | failed | 0 / 0 | MIT |
| rgblink-vsp628pro | RGBlink VSP 628pro | failed | 0 / 0 | MIT |
| riedel-mediornet | Riedel Mediornet | no-send | 0 / 0 | MIT |
| riedel-rrcs | Riedel RRCS | failed | 0 / 0 | MIT |
| riedel-smartpanel | Riedel Communications Smart Panel | no-send | 0 / 20 | MIT |
| rode-rcv | RØDECaster Video (RCV) | failed | 0 / 0 | MIT |
| rogueamoeba-farrago | Rogue Amoeba Farrago | failed | 0 / 0 | MIT |
| roku-tv | Roku TV | failed | 0 / 0 | MIT |
| roland-p20hd | Roland P-20HD | failed | 0 / 0 | MIT |
| roland-v160hd | Roland V-160HD | builtin | 0 / 0 | MIT |
| roland-v600uhd | Roland V-600UHD | failed | 0 / 0 | MIT |
| roland-v60hd | Roland V-60HD | failed | 0 / 0 | MIT |
| roland-vr120hd | Roland VR-120HD | builtin | 0 / 0 | MIT |
| roland-vr400uhd | Roland VR-400UHD | list-only | 0 / 11 | MIT |
| roland-xs84h | Roland XS-82H / XS-83H / XS-84H | failed | 0 / 0 | MIT |
| rossvideo-nkrouter | Ross Video NK Router | failed | 0 / 0 | MIT |
| rossvideo-rosstalk | Ross Video Rosstalk | failed | 0 / 0 | MIT |
| rossvideo-xpression | Ross Video Xpression | failed | 0 / 0 | MIT |
| rundown-studio | Rundown Studio | failed | 0 / 0 | MIT |
| samsung-display | Samsung MD Display | failed | 0 / 0 | MIT |
| samsung-smarttv | Samsung Smart TV | failed | 0 / 0 | MIT |
| samsung-tizenos | Samsung TizenOS | list-only | 0 / 3 | MIT |
| sennheiser-digital6000 | Sennheiser EM 6000 / EM 6000 Dante / L 6000 | failed | 0 / 0 | MIT |
| sennheiser-ewdx | Sennheiser EM2 / EM2 Dante / EM4 / CHG70N / CHG70N-C | failed | 0 / 0 | MIT |
| sevenpointtechnologies-7pointaudio | Seven Point Technologies, LLC 7 Point Audio | full | 17 / 17 | MIT |
| sgl-dct | SGL DCT | failed | 0 / 0 | MIT |
| shelly-http | Shelly 1 / Shelly 2.5 / Shelly Dimmer1/2 / Shelly RGBW2 | failed | 0 / 0 | MIT |
| shelly-ws | Shelly Plus 1 / Shelly Plus 1PM / Shelly Plus 2PM / Shelly Pro 1 / Shelly Pro… | failed | 0 / 0 | MIT |
| showcuesystems-scs | Show Cue Systems SCS | failed | 0 / 0 | MIT |
| shure-chargers | Shure SBRC / SB-220 / SB-240 | failed | 0 / 0 | MIT |
| shure-dca901 | Shure DCA901 | failed | 0 / 0 | MIT |
| shure-mxa910 | Shure MXA910 / MXA920 | failed | 0 / 0 | MIT |
| shure-mxcw | Shure Microflex Complete Wireless (MXCW) | failed | 0 / 0 | MIT |
| shure-mxn5 | Shure MXN-5 | failed | 0 / 0 | MIT |
| shure-mxw | Shure Microflex (MXW) | failed | 0 / 0 | MIT |
| shure-p300 | Shure P300 | failed | 0 / 0 | MIT |
| shure-psm1000 | Shure PSM1000 | failed | 0 / 0 | MIT |
| shure-scm820 | Shure SCM820 | failed | 0 / 0 | MIT |
| shure-wireless | Shure ULX-D / QLX-D / SLX-D / Axient Digital (AD) | failed | 0 / 0 | MIT |
| sikn-kerkomroep | sikn kerkomroep | failed | 0 / 0 | MIT |
| simedia-yesapi | Si Media Yes Api Gateway | failed | 0 / 0 | MIT |
| simonhyde-piclock | Simon Hyde PiClock | failed | 0 / 0 | MIT |
| singularlive-studio | Singular.Live Studio | failed | 0 / 0 | MIT |
| skaarhoj-rawpanel | SKAARHOJ Raw Panel | partial | 1 / 9 | MIT |
| slack-webhooks | Slack Webhooks | failed | 0 / 0 | MIT |
| smartavi-ipmatrix | Smart-AVI MU-88 / MXU-88 / MXCORE | failed | 0 / 0 | MIT |
| smodetech-smodelive | Smode Live | failed | 0 / 0 | MIT |
| smokotnin-opensoundmeter | Pavel Smokotnin Open Sound Meter | failed | 0 / 0 | MIT |
| snapav-wattbox | Snapav Wattbox | failed | 0 / 0 | MIT |
| socialstream-ninja | Social Stream Ninja | failed | 0 / 0 | MIT |
| softouch-easyworship | Softouch Development Inc EasyWorship | failed | 0 / 0 | MIT |
| softron-movierecorder | Softron MovieRecorder | failed | 0 / 0 | MIT |
| softron-mreplay | Softron M|Replay | failed | 0 / 0 | MIT |
| softron-multicamlogger | Softron Multicam Logger | failed | 0 / 0 | MIT |
| softron-ontheairvideo | Softron OnTheAir Video | failed | 0 / 0 | MIT |
| softvelum-nimble-streamer | Softvelum Nimble Streamer | failed | 0 / 0 | MIT |
| softvelum-wmspanel | Softvelum WMSPanel | failed | 0 / 0 | MIT |
| songbeamer-osc | Songbeamer OSC | failed | 0 / 0 | MIT |
| sonos-speakers | Sonos Speakers | failed | 0 / 0 | MIT |
| sony-bravia-simpleip | Sony Bravia Simple IP | partial | 3 / 7 | MIT |
| sony-bravia | Sony Bravia | failed | 0 / 0 | MIT |
| sony-cled | Sony ZRCT-300 | no-send | 0 / 16 | MIT |
| sony-ptz | Sony BRC-AM7 / SRG-A40 / SRG-A12 / ILME-FR7 | failed | 0 / 0 | MIT |
| sony-serialtally | Sony XVS 9000/8000/7000/6000 / XVS-G1 / MLS-X1 | failed | 0 / 0 | MIT |
| sony-srg-a12 | Sony SRG-A12 | failed | 0 / 0 | MIT |
| sony-visca | Sony VISCA | failed | 0 / 0 | MIT |
| soundcraft-ui | Soundcraft Ui12 / Ui16 / Ui24R | no-send | 0 / 0 | MIT |
| sounddevices-pixnet | Sound Devices PIXNET | failed | 0 / 0 | MIT |
| soundtrack-remote | Soundtrack Your Brand Remote | no-send | 0 / 0 | MIT |
| spacecommz-intercom | Spacecommz.io SpaceCommz | failed | 0 / 0 | MIT |
| spotify-remote | Spotify Web API and Controller | failed | 0 / 0 | MIT |
| spx-graphics-controller | spx gc | failed | 0 / 0 | MIT |
| squared-powerlink | Square D NF3500G4 / NF3000G3 / NF2000G3 | failed | 0 / 0 | MIT |
| stagetec-emberplus-avatus | STAGETEC Official Ember+ Avatus | failed | 0 / 0 | MIT |
| stagetec-emberplus-nxct | STAGETEC Official Ember+ NEXUS compact | failed | 0 / 0 | MIT |
| stagetec-rcp | StageTec XDIP / NXC-T | failed | 0 / 0 | MIT |
| stagetec-xci | Stagetec XCI03 | no-send | 0 / 2 | MIT |
| stagetimerio-api | stagetimer.io Stagetimer API | list-only | 0 / 32 | MIT |
| studiocoast-vmix | StudioCoast vMix | failed | 0 / 0 | MIT |
| symetrix-dsp | Symetrix DSP | failed | 0 / 0 | MIT |
| syncer-live | Zusor Syncer.live | failed | 0 / 0 | MIT |
| tagvs-mcs | TAG Video Systems MCS | no-send | 0 / 11 | MIT |
| tascam-bdmp1 | Tascam BD-MP1 | failed | 0 / 0 | MIT |
| tascam-cd | Tascam SS-CDR250N / SS-R250N | failed | 0 / 0 | MIT |
| tascam-cd400u | Tascam CD-400U / CD-400U DAB | failed | 0 / 0 | MIT |
| tascam-da-6400 | Tascam DA-6400 / DA-6400dp | failed | 0 / 0 | MIT |
| tasmota-http | Tasmota HTTP | failed | 0 / 0 | MIT |
| techministry-beacon | Tech Ministry Beacon | failed | 0 / 0 | MIT |
| techministry-midirelay | Tech Ministry MIDI Relay | failed | 0 / 0 | MIT |
| techministry-spotifycontroller | Tech Ministry Spotify Controller | failed | 0 / 0 | MIT |
| techministry-tallyarbiter | Tech Ministry Tally Arbiter | no-send | 0 / 3 | MIT |
| techministry-timekeeper | Tech Ministry TimeKeeper | failed | 0 / 0 | MIT |
| telegram-bot | Telegram Bot | failed | 0 / 0 | MIT |
| telestream-prism | Telestream Prism / MPI2 / MPX2 / MPD / MPP / MPS | list-only | 0 / 171 | MIT |
| televic-confero | Televic Plixus MME / Plixus AE-R / Plixus WAP / D-Cerno AE | failed | 0 / 0 | MIT |
| tellyo-streamstudio | Tellyo Stream Studio | failed | 0 / 0 | MIT |
| telos-25-seven-program-delay-manager | Telos 25-Seven PDM/PDM II Broadcast Delay | partial | 2 / 5 | MIT |
| teradek-prism | Teradek Prism / Prism Flex | failed | 0 / 0 | MIT |
| teradek-vidiux | Teradek VidiU X | failed | 0 / 0 | MIT |
| tesla-smart | Tesla smart 8>1 | failed | 0 / 0 | MIT |
| tesmart-hdmimatrix | TESMART HDMI Matrix (multiple variants) | failed | 0 / 0 | MIT |
| textmebot-whatsappapi | TextMeBot WhatsAppApi | failed | 0 / 0 | MIT |
| theatrixx-xpresscue | Theatrixx xPressCue | failed | 0 / 0 | MIT |
| thingm-blink1 | ThingM Blink(1) | failed | 0 / 0 | MIT |
| tieline-gateway | Tieline Gateway / Via | failed | 0 / 0 | MIT |
| timemachines-clock | TimeMachines Clock | failed | 0 / 0 | MIT |
| tinkerlist-cuez-automator | TinkerList Cuez - Automator | failed | 0 / 0 | MIT |
| toggl-track | Toggl Track | no-send | 0 / 5 | MIT |
| toolsonair-justincapture | ToolsOnAir just:in Capture Solutions | failed | 0 / 0 | MIT |
| tow-mixeffect | Adam Tow MixEffect | failed | 0 / 0 | MIT |
| tplink-kasasmartbulb | TP-Link Kasa Smart Bulb | failed | 0 / 0 | MIT |
| tplink-kasasmartdimmer | TP-Link Kasa Smart Dimmer | failed | 0 / 0 | MIT |
| tplink-kasasmartplug | TP-Link Kasa Smart Plug | failed | 0 / 0 | MIT |
| tplink-taposmartplug | TP-Link Tapo Smart Plug | failed | 0 / 0 | MIT |
| tractus-ndirouter | Tractus Events Tractus Router for NDI | failed | 0 / 0 | MIT |
| trms-cablecast | Tightrope Media Systems Cablecast | failed | 0 / 0 | MIT |
| trms-mediascribe | Tightrope Media Systems MediaScribe | failed | 0 / 0 | MIT |
| tslproducts-umd | TSL Products UMD protocol | failed | 0 / 0 | MIT |
| tslproducts-umdlistener | TSL Products UMD Listener | failed | 0 / 0 | MIT |
| tslproducts-usp3 | TSL Products Universal Switch Panel | no-send | 0 / 2 | MIT |
| turtleav-mineola | Turtle AV Mineola 2x2 / Mineola 4x4 / Mineola 8x8 / Mineola 16x16 / Phoenix 8x8 | no-send | 0 / 0 | MIT |
| twitch-api | Twitch Chat & API | failed | 0 / 0 | MIT |
| twoloox-pandorasbox | twoloox Pandoras Box | failed | 0 / 0 | MIT |
| ubiquiti-unifi | Ubiquiti Unifi / USW | failed | 0 / 0 | MIT |
| uniliga-cg | Uniliga CG | failed | 0 / 0 | MIT |
| utahscientific-bpspanel | Utah Scientific BPS | failed | 0 / 0 | MIT |
| uts-remotevolume | UTS Remote Volume | failed | 0 / 0 | MIT |
| vaddio-ptz | Vaddio PTZ Camera | failed | 0 / 0 | MIT |
| vbaudio-voicemeeter | VBAudio Voicemeeter | partial | 5 / 29 | MIT |
| vdo-ninja | VDO Ninja | failed | 0 / 0 | MIT |
| ventuz-director | Ventuz Technology Director | failed | 0 / 0 | MIT |
| vicreo-broadcast-titles | VICREO Broadcast Titles | failed | 0 / 0 | MIT |
| vicreo-display | VICREO Display | failed | 0 / 0 | MIT |
| vicreo-hotkey | VICREO Listener | failed | 0 / 0 | MIT |
| videolan-vlc | VideoLAN VLC | list-only | 0 / 18 | MIT |
| vioso-exaplay | vioso exaplay | failed | 0 / 0 | MIT |
| vistream-online | ViStream online | failed | 0 / 0 | MIT |
| visualproductions-iocore | Visual Productions IoCore2 | full | 10 / 10 | MIT |
| visualproductions-timecore | Visual Productions Timecore | failed | 0 / 0 | MIT |
| vitec-avediaplayer9300-series | Vitec AvediaPlayer r9300 / AvediaPlayer r9310 / AvediaPlayer m9305 / AvediaPl… | failed | 0 / 0 | MIT |
| vivitek-projector | Vivitek Projector | failed | 0 / 0 | MIT |
| vizio-smartcast | VIZIO SmartCast | failed | 0 / 0 | MIT |
| vizrt-mosart | Vizrt Mosart | failed | 0 / 0 | MIT |
| vizrt-tcp-engine-trio | vizRT Send Command Line | failed | 0 / 0 | MIT |
| voicemod-api | Voicemod | failed | 0 / 0 | MIT |
| vrowllabs-vrsync | VR Owl Labs VR Sync | failed | 0 / 0 | MIT |
| vyv-photon | VYV Photon | failed | 0 / 0 | MIT |
| webcomms-panel | Web Comms Panel | failed | 0 / 0 | MIT |
| wheatstone-wheatnet | Wheatstone WheatNet IP | partial | 13 / 16 | MIT |
| wled-websocket | WLED | failed | 0 / 0 | MIT |
| wordnik-api | Wordnik API | partial | 2 / 3 | MIT |
| wyrestorm-matrix | Wyrestorm Matrix Switcher | list-only | 0 / 3 | MIT |
| yamaha-rcp | Yamaha RCP | failed | 0 / 0 | MIT |
| youtube-live | Google YouTube | failed | 0 / 0 | MIT |
| zenvideo-ndirouter | ZEN NDIRouter | failed | 0 / 0 | MIT |
| zerodensity-realityhub | Zerodensity RealityHub 1.3 | failed | 0 / 0 | MIT |
| zinc-oscpoint | Zinc OSCPoint | failed | 0 / 0 | MIT |
| zipsolutions-zipcaptions | Zip Solutions Zip Captions | failed | 0 / 0 | MIT |
| zoom-osc-iso | Zoom OSC/ISO | failed | 0 / 0 | MIT |
| zoom-tiles | Zoom Tiles | failed | 0 / 0 | MIT |
| zowietek-api | Zowietek ZowieBox / ZowiePTZ / ZowieCam | failed | 0 / 0 | MIT |
