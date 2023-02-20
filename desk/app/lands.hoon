/-  *lands
/-  g=groups, d=diary
/+  default-agent, dbug
|%
+$  versioned-state
  $%  state-0
  ==
+$  state-0
  $:  [%0 values=(list @)]
  ==
+$  card  card:agent:gall
--
%-  agent:dbug
=|  state-0
=*  state  -
^-  agent:gall
|_  =bowl:gall
+*  this  .
    default  ~(. (default-agent this %.n) bowl)
++  on-init  on-init:default
++  on-save  !>(state)
++  on-load
  |=  old=vase
  ^-  (quip card _this)
  `this(state !<(state-0 old))
++  on-poke
  |=  [=mark =vase]
  ^-  (quip card _this)
  ?>  ?=(%lands-action mark)
  =/  act  !<(action vase)
  ?-  -.act
      %push
    ?:  =(our.bowl target.act)
      `this(values [value.act values])
    ?>  =(our.bowl src.bowl)
    :_  this
    [%pass /pokes %agent [target.act %lands] %poke mark vase]~
  ::
      %pop
    ?:  =(our.bowl target.act)
      `this(values ?~(values ~ t.values))
    ?>  =(our.bowl src.bowl)
    :_  this
    [%pass /pokes %agent [target.act %lands] %poke mark vase]~
  ::
      %yell
    ?:  =(our.bowl target.act)
      :: all groups
      :: ~&  .^(groups:g %gx /(scot %p our.bowl)/groups/(scot %da now.bowl)/groups/groups)
      :: all diaries
      :: ~&  .^(shelf:d %gx /(scot %p our.bowl)/diary/(scot %da now.bowl)/shelf/shelf)
      ~&  .^(notes:d %gx /(scot %p our.bowl)/diary/(scot %da now.bowl)/diary/(scot %p ~bud)/bud-notes/notes/newest/2/note/diary-notes)
      `this
    ?>  =(our.bowl src.bowl)
    :_  this
    [%pass /pokes %agent [target.act %lands] %poke mark vase]~
  ==
++  on-peek
  |=  =path
  ^-  (unit (unit cage))
  ?+  path  (on-peek:default)
    [%x %values ~]  ``noun+!>(values)
  ==
++  on-arvo   on-arvo:default
++  on-watch  on-watch:default
++  on-leave  on-leave:default
++  on-agent  on-agent:default
++  on-fail   on-fail:default
--
