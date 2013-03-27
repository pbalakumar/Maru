
/*!
 * @class LoginManager
 * @description Handles everything for Login, Register, Recover & Reset Password
 */

(function() {

  // Main class protoype
  function DashboardManager(container) {
    var _self = this;
    this.baseTitle = 'Marucci Elite Dashboard | ';
    this.container = container;
    this.hasPushstate = !!(window.history && history.pushState);
    this.teamMemberList = $('#team-setup', container);
    this.teamMembersList = $('#team-members', container);
    this.account = $('#account', container);
    this.teamHomeMenu = $('.team-home-menu', container);
    this.bookingsHomeMenu = $('.bookings-home-menu', container);
    this.invitePlayerForm = $('#invite-player', container);
    this.teamMembersLink = $('.team-members-trigger', container);
    this.invitePlayerLink = $('.invite-player-trigger', container);
    this.teamHomeLink = $('.team-home-trigger a', container);
    this.dashboardHomeLink = $('.dashboard-home-trigger', container);
    this.bookingsHomeLink = $('.bookings-home-trigger', container);
    this.calendarLink = $('li.calendar-view-trigger', container);
    this.calendarView = $('#bookings-calendar', container);
    this.invitePlayerForm = $('#invite-player-form');
    this.invitePlayerForm = $('#invite-player', container);
    this.updatePlayerAccountBtn = $('#update-player-account-btn', container);
    this.invitePlayerSubmit = $('#invite-player-submit', container);
    this.saveTeamBtn = $('#team-create-save-btn', container);
    this.teamCreateInviteBtn = $('#team-create-invite-btn', container);
    this.addResponsiblePartyBtn = $('#add-responsible-party-invite-btn', container);
    this.hideAll = _.bind(this.hideAll, this);
    this.setTitle = _.bind(this.setTitle, this);
    this.showTeamSetup = _.bind(this.showTeamSetup, this);
    this.showInvitePlayerForm = _.bind(this.showInvitePlayerForm, this);
    this.invitePlayer = _.bind(this.invitePlayer, this);
    this.updatePlayer = _.bind(this.updatePlayer, this);
    this.showDashboardHome = _.bind(this.showDashboardHome, this);
    this.showTeamHome = _.bind(this.showTeamHome, this);
    this.showBookingsHome = _.bind(this.showBookingsHome, this);
    this.showCalendar = _.bind(this.showCalendar, this);
    this.createEvent = _.bind(this.createEvent, this);
    this.validateAndSetDateTime = _.bind(this.validateAndSetDateTime, this);
    this.deletePlayerConfirm = _.bind(this.deletePlayerConfirm, this);
    this.viewPlayer = _.bind(this.viewPlayer, this);
    this.populateAndSetData = _.bind(this.populateAndSetData, this);
    this.filterMembers = _.bind(this.filterMembers, this);
    this.displayEventView = _.bind(this.displayEventView, this);
    this.displayDeleteEventConfirmDialog = _.bind(this.displayDeleteEventConfirmDialog, this);
    this.deleteEvent = _.bind(this.deleteEvent, this);
    this.showAccount = _.bind(this.showAccount, this);
    this.populateTableViaJSON = _.bind(this.populateTableViaJSON, this);
    this.makePlayerDataTableEditable = _.bind(this.makePlayerDataTableEditable, this);
    this.buildJSONFromTable = _.bind(this.buildJSONFromTable, this);
    this.updatePlayerAccount = _.bind(this.updatePlayerAccount, this);
    this.setNavigationOff = _.bind(this.setNavigationOff, this);
    this._insertClonedRow = _.bind(this._insertClonedRow, this);
    this.buildTeamDataAndPostCreate = _.bind(this.buildTeamDataAndPostCreate, this);
    this.inviteCoach = _.bind(this.inviteCoach, this);
    this.invitePlayers = _.bind(this.invitePlayers, this);
    this.clearCallToAction = _.bind(this.clearCallToAction, this);
    this.showInviteResponsibleParty = _.bind(this.showInviteResponsibleParty, this);
    this.init = _.bind(this.init, this);
    this.saveTeamBtn.on('click', function(evt) {
      _self.buildTeamDataAndPostCreate(evt);
    });
    this.teamCreateInviteBtn.on('click', function(evt) {
      _self._insertClonedRow(1);
    });
    this.addResponsiblePartyBtn.on('click', _self.showInviteResponsibleParty);
    this.teamMembersLink.on('click', _self.showTeamSetup);
    this.teamHomeLink.on('click', _self.showTeamHome);
    this.dashboardHomeLink.on('click', _self.showDashboardHome); 
    this.bookingsHomeLink.on('click', _self.showBookingsHome);
    this.calendarLink.on('click', _self.showCalendar);
    this.invitePlayerLink.on('click', _self.showInvitePlayerForm);
    this.invitePlayerSubmit.on('click', function(evt) { 
      _self.invitePlayerSend(evt);
    });
    this.updatePlayerAccountBtn.on('click', function(evt) {
      _self.updatePlayerAccount(evt);
    });
    this.init();
  };

  /*!
   * @public init
   */

  DashboardManager.prototype.init = function(options) {
    var _self = this;
    (typeof(console) !== 'undefined') ? console.log('Init DashboardManager') : null;
    options = options || {};
    // -- check for call to action --
    if (APP.user.needs_profile_setup && APP.user.needs_profile_setup === true && $(location).attr('pathname') !== '/dashboard/account/') {
      window.location = '/dashboard/account/';
    } else if (APP.user.needs_team_setup && APP.user.needs_team_setup === true && $(location).attr('pathname') !== '/dashboard/team/setup/') {
      window.location = '/dashboard/team/setup/';
    };
    switch ($(location).attr('pathname')) {
      // new spec
      case '/dashboard/account/':
        this.action = 'account';
        this.showAccount();
        break;
      // old spec
      case '/dashboard/':
        this.action = 'home';
        this.showDashboardHome();
        break;
      case '/dashboard/team/setup/':
        this.action = 'setup';
        this.showTeamSetup();
        break;
      case '/dashboard/team/':
        this.action = 'team';
        this.showTeamHome();
        break;
      case '/dashboard/team/invite/':
        this.action = 'invite';
        this.showInvitePlayerForm();
        break;
      case '/dashboard/bookings/':
        this.action = 'bookings';
        this.showBookingsHome();
        break;
      case '/dashboard/bookings/calendar/':
        this.action = 'calendar';
        this.showCalendar();
    }
  };

  /**
   * @private _formatPlayerAttributeName
   * @description Prettify/Format Player Attribute name for view
   **/

  function _formatPlayerAttributeName(str) {
    return str.toString().replace(/_/m, ' ');
  };

  // Populate the Player View
  DashboardManager.prototype.populateAndSetData = function(id) {
    var _self = this;
    // Toggle Buttons
    if (_self.playerAction === 'view') {
      $('#update-member-modal-btn').hide();
      $('#invite-member-modal-btn').hide();
    } else if (_self.playerAction === 'invite') {
      $('#update-member-modal-btn').hide();
      $('#invite-member-modal-btn').show();
    } else if (_self.playerAction === 'update') {
      $('#update-member-modal-btn').show();
      $('#invite-member-modal-btn').hide();
    };
    // Clear View
    $('#modal-player td:last-child').text('');
    // Setup Data for View & Update
    if (_self.playerAction === 'view' || _self.playerAction === 'update') {
      // Set ID on Modal
      $('#modal-player').attr('data-id', id);
      // Populate Player Information
      var member = $.grep(_self.teamMembers, function(item) {
        return item._id.toString() === id.toString();
      });
      // First Item is the Resulting Filtered Array Object
      member = member[0];
      // Build out player object and HTML
      _.map(member, function(attr, index) {
        var attr = index;
        var data = member[index];
        // Check if attr Exists
        if (typeof(member[attr]) === 'object') {
          _.map(member[attr], function(attrNested, indexNested) {
            var nestedAttributeRedux = attr.toString() + '.' + indexNested.toString();
            var attrContainer = $('#modal-player td[data-id="' + nestedAttributeRedux + '"]');
            if (attrContainer.length === 1) {
              var data = attrNested;
              attrContainer.closest('td').text(data);
            };
          });
        } else {
          var attrContainer = $('#modal-player td[data-id="' + attr + '"]');
          if (attrContainer.length === 1) {
            attrContainer.closest('td').text(data);
          };
        };
      });
    };
    // Player Name Title || Prompt
    if (_self.playerAction === 'view') {
      $('#populate-player thead th').text(member.profile.firstname + ' ' + member.profile.lastname);
    } else if (_self.playerAction === 'update') {
      $('#populate-player thead th').text(member.profile.firstname + ' ' + member.profile.lastname + ' - Click to Edit!');
    } else {
      $('#populate-player thead th').text('Click to Edit!');
    };
    // Setup Editables
    if (_self.playerAction === 'invite' || _self.playerAction === 'update') {
      // all editable fields selector
      var allFields = $('#modal-player td:last-child');
      // check that editables have been setup, otherwise setup. if already setup, destroy
      if (_self.editablesSetup && _self.editablesSetup === true) {
        // destroy possible previous editables
        $(allFields).editable('destroy');
      } else {
        _self.editablesSetup = true;
      };
      // default all editable fields to text type
      allFields.editable();
      // set editable selects
      $('#modal-player td[data-id="player.throwing"]').editable({
        type: 'select',
        options: { 'left':'left', 'right':'right', 'both':'both' },
      });
      $('#modal-player td[data-id="player.batting"]').editable({
        type: 'select',
        options: { 'left':'left', 'right':'right', 'switch':'switch' },
      });
    };
  };

  // Populate a Table with a proxied JSON Object
  DashboardManager.prototype.populateTableViaJSON = function(tableSelector, dataToPopulate) {
    var _self = this;
    // Clear View
    $('td:last-child', tableSelector).text('');
    // Build out object and HTML
    _.map(dataToPopulate, function(attr, index) {
      var attr = index;
      var data = dataToPopulate[index];
      // Check if attr Exists
      if (typeof(dataToPopulate[attr]) === 'object') {
        _.map(dataToPopulate[attr], function(attrNested, indexNested) {
          var nestedAttributeRedux = attr.toString() + '.' + indexNested.toString();
          var attrContainer = $('td[data-id="' + nestedAttributeRedux + '"]', tableSelector);
          if (attrContainer.length === 1) {
            var data = attrNested;
            attrContainer.closest('td').text(data);
          };
        });
      } else {
        var attrContainer = $('td[data-id="' + attr + '"]', tableSelector);
        if (attrContainer.length === 1) {
          attrContainer.closest('td').text(data);
        };
      };
    });
  };

  // Make a Table with Player Data Editable
  DashboardManager.prototype.makePlayerDataTableEditable = function(tableSelector) {
    var _self = this
      , allFields = $('td:last-child', tableSelector);
    // check that editables have been setup, otherwise setup. if already setup, destroy
    if (_self._playerTableEditable && _self._playerTableEditable === true) {
      // destroy possible previous editables
      $(allFields).editable('destroy');
    } else {
      _self._playerTableEditable = true;
    };
    // default all editable fields to text type
    allFields.editable({

    });
    // set editable selects
    $('td[data-id="player.throwing"]', tableSelector).editable({
      type: 'select',
      options: { 'left':'left', 'right':'right', 'both':'both' }
    });
    $('td[data-id="player.batting"]', tableSelector).editable({
      type: 'select',
      options: { 'left':'left', 'right':'right', 'switch':'switch' }
    });
  };

  /*!
   * @public buildJSONFromTable
   * @param {Object} tableSelector jQuery Selector of a valid table
   * @return {Object} _JSON JSON representation of the table data
   */

  DashboardManager.prototype.buildJSONFromTable = function(tableSelector) {
    var _self = this, _JSON = '{';
    $('tr', tableSelector).each(function(index, elem) {
      var td = $(this).find('td:last-child');
      var attr = td.attr('data-id');
      var data = td.text();
      if (attr !== undefined && data !== '') {
        _JSON += '"' + attr + '"' + ':' + '"' + data + '",';
      };
    });
    _JSON = _JSON.slice(0, - 1) + '}';
    return $.parseJSON(_JSON);
  };

  // Create Team Initial
  DashboardManager.prototype.buildTeamDataAndPostCreate = function() {
    var _self = this, data = {};
    data.team = {
      "league"          : $('select[name="team.league"]', this.container).val(),
      "age_group"       : $('select[name="team.age_group"]', this.container).val(),
      "team_name"       : $('input[name="team.team_name"]', this.container).val(),
      "tournament"      : $('select[name="team.tournament"]', this.container).val(),
      "assistant_coach" : $('input[name="team.assistant_coach"]', this.container).val(),
      "sanction_bodies" : $('select[name="team.sanction_bodies"]', this.container).val()
    };
    // current user is the owner
    data.owner = APP.user._id;
    // notify the process start
    _self.displayMessage('Creating Team and Attaching Owner to new Team...');
    // POST to create team
    $.ajax({
      type     : 'POST',
      url      : '/team/',
      dataType : 'json',
      data: data,
      success: function(result) {
        APP.team = result;
        // success - onwards
        _self.displayMessage('Succesfully Created Team and Attached Owner to Team!');
        // invite coach to team _id
        _self.inviteCoach(result._id);
        // invite players to team _id
        _self.clearCallToAction(APP.user._id);
        _self.invitePlayers(result._id, function() {
          window.location = '/user/logout/';
        });
      },
      error: function() {
        _self.displayError('Error Creating Team! Please try again later!');
      }
    });
  };

  /*!
   * @public showInviteResponsiblePartyInvite
   * @description Display Modal for inviting a responsible party
   */

  DashboardManager.prototype.showInviteResponsibleParty = function() {
    var _self = this;
    if (!APP.team || (APP.team && !APP.team._id)) {
      return _self.displayError('Please Create your Team First!');
    };
    // init modal
    $('#modal-invite-responsible-party').modal({});
    // bind validation and post callback
    var form = $('#invite-party-form')
      , inviteData = $(form).serialize()
      , endpoint = '/invite/new/responsible_party/' + APP.team._id + '/';
    form.validate(function() {
      $.post(endpoint, inviteData, function(result) {
        // hide modal first
        $('#modal-event').modal('hide');
        if (result.error) {
          _self.displayError(result.error);
        } else {
          _self.displayMessage('Responsible Party Invited!');
        };
      });
    });
  };

  /*!
   * @public inviteCoach
   */

  DashboardManager.prototype.inviteCoach = function(teamId) {
    var _self = this;
    // set JSON invite for coach with some prefilled fields
    var coachInvite = {
      "email"       : $('input[name="coach.email"]').val(),
      "team_id"     : teamId,
      "prefilled"   : {
        "firstname" : $('input[name="coach.firstname"]').val(),
        "lastname"  : $('input[name="coach.lastname"]').val(),
      }
    };
    // POST to create coach and attach
    $.ajax({
      type     : 'POST',
      url      : '/invite/new/coach/' + teamId + '/',
      dataType : 'json',
      data: coachInvite,
      success: function(response) {
        if (response.error) {
          _self.displayError('Error Inviting Coach! Please try again later!');
        } else {
          APP.coach = response;
          _self.displayMessage('Succesfully Invited Coach!');
        }
      },
      error: function() {
        _self.displayError('Error Inviting Coach! Please try again later!');
      }
    });
  };

  /*!
   * @public invitePlayers
   */

  DashboardManager.prototype.invitePlayers = function(teamId, callback) {
    var _self = this;
    // JSON Array of all players with data to be invited
    var players = _self.players = $('#member-player-list-table').tableRowsToJSONWithFilter('player', 'player.email');
    players = JSON.stringify({ players : players });
    // POST to create team
    $.ajax({
      type        : 'POST',
      url         : '/invite/new/players/' + teamId + '/',
      contentType : 'application/json; charset=utf-8',
      dataType    : 'json',
      data: players,
      success: function(response) {
        if (response.error) {
          _self.displayError(response.error);
        } else {
          APP.players = response;
          // success - onwards
          _self.displayMessage('Succesfully Invited Team Members!');
          setTimeout(function() {
            callback();
          }, 1500);
        };
      },
      error: function() {
        _self.displayError('Error Inviting Team Members! Please try Again!');
      }
    });
  };

  /*!
   * @public setNavigationOnOrOff
   * @param {Boolean} setting true for on, false for off
   * @description Used primary when a call-to-action is needed, disable dashboard nav
   */

  DashboardManager.prototype.setNavigationOff = function() {
    var _self = this, nav = $('nav#primary', this.container);
    // disable menu
    $('li', nav).removeClass().off().find('a').off().removeAttr('href');
    //this.showTeamHome = function(){};
    $(nav).fadeTo(250, 0.5);
  };

  /*!
   * @public calculateExpenses
   * @description Update expenses calculations on the bottom of the team homepage
   */

  DashboardManager.prototype.calculateExpenses = function() {
    var _self = this;
    var tableSelector = $('#member-player-list-table');
    var RPF = FM = TMPD = TMRPD = PWCCOFT = CMRPD = 0;
    // set data method for on change
    var setData = function(_RPF, _FM, _TMPD, _TMRPD, _PWCCOFT, _CMRPD) {
      $('#calc-1 p', _self.container).text(_RPF.toFixed(2)).addClass('strong');
      $('#calc-2 p', _self.container).text(_FM.toFixed(2)).addClass('strong');
      $('#calc-3 p', _self.container).text(_TMPD.toFixed(2)).addClass('strong');
      $('#calc-4 p', _self.container).text(_TMRPD.toFixed(2)).addClass('strong');
      $('#calc-5 p', _self.container).text(_PWCCOFT.toFixed(2)).addClass('strong');
      $('#calc-6 p', _self.container).text(_CMRPD.toFixed(2)).addClass('strong');
    }
    // players JSON
    _self.players = JSON.parse(tableSelector.tableRowsToJSONWithFilter('player', 'player.email'));
    // iterate and calculate
    if (_self.players.length === 0) {
      return false;
    } else {
      // reserved practive field
      RPF = _self.players.length * 42;
      // facility member
      if (_self.players.length >= 8) {
        FM = _self.players.length * 75;
      } else {
        FM = _self.players.length * 100;
      };
      // total monthly player dues
      TMPD = 0;
      // players with credit cards on file
      PWCCOFT = 0;
      _.map(_self.players, function(player) {
        // total monthly player dues
        //.....TO-DO
      });
      // set calculated data
      setData(RPF, FM, TMPD, TMRPD, TMRPD, CMRPD);
    }
  };

  /*!
   * @public updatePlayerAccount
   * @description Update a Players Account
   */

  DashboardManager.prototype.updatePlayerAccount = function(evt) {
    var _self = this
      , memberId = $('#account', this.container).attr('data-id');
    evt.preventDefault();
    // build JSON representing the users account
    var _JSON = _self.buildJSONFromTable($('#account table', this.container));
    // mark that the account is setup
    _JSON['needs_profile_setup'] = false;
    // Post UPDATE
    $.ajax({
      type     : 'POST',
      url      : '/user/update/' + memberId + '/',
      dataType : 'json',
      data: _JSON,
      success: function() {
        _self.displayMessage('Account Succesfully Updated!');
        // reset session by logging in?
        if (APP.user.needs_profile_setup === true) {
          _self.displayMessage('Please Log In Now!');
          setTimeout(function() {
            window.location = '/user/logout/';
          }, 1000);
        };
      },
      error: function() {
        _self.displayError('Error Updating Account! Please try again later!');
      }
    });
  };

  // Hide all UI
  DashboardManager.prototype.hideAll = function() {
    this.teamMemberList.hide();
    this.teamHomeMenu.hide();
    this.bookingsHomeMenu.hide();
    this.invitePlayerForm.hide();
    this.calendarView.hide();
    this.account.hide();
    this.teamMembersList.hide();
    // Remove all Active status from menu items
    $('.main-nav li', this.container).removeClass('active');
    this.setTitle();
  };

  // Dashboard Home
  DashboardManager.prototype.showDashboardHome = function() {
    this.action = 'home';
    this.titleVerb = 'Home';
    this.setPath('/dashboard/');
    this.hideAll();
    this.dashboardHomeLink.addClass('active');
  };

  // Team Home
  DashboardManager.prototype.showTeamHome = function() {
    this.action = 'team';
    this.titleVerb = 'Team';
    this.setPath('/dashboard/team/');
    this.hideAll();
    this.teamHomeMenu.show();
    this.showTeamMembers();
  };

  // Team Home
  DashboardManager.prototype.showAccount = function() {
    var _self = this;
    this.action = 'account';
    this.titleVerb = 'Account';
    this.setPath('/dashboard/account/');
    this.hideAll();
    // disable nav?
    if (APP.user.needs_profile_setup && APP.user.needs_profile_setup === true) {
      this.setNavigationOff();
    };
    this.account.show();
    var table = $('#account table', this.container);
    this.populateTableViaJSON(table, APP.user);
    this.makePlayerDataTableEditable();
    this.displayMessage('Please Check & Update ALL of your Account Information, then Click "Update" to use the Rest of the Site!')
  };

  // Invite Player
  DashboardManager.prototype.showInvitePlayerForm = function() {
    var _self = this;
    $('#modal-player').modal({});
  };

  // display team setup view
  DashboardManager.prototype.showTeamSetup = function() {
    var _self = this;
    this.action = 'setup';
    this.titleVerb = 'Setup Team';
    this.hideAll();
    // disable nav?
    if (APP.user.needs_team_setup && APP.user.needs_team_setup === true) {
      this.setNavigationOff();
    } else {
      this.teamHomeMenu.show();
      this.teamHomeLink.parent().addClass('active');
      this.teamMembersLink.addClass('active');
    };
    // fetch existing team members
    _self._insertClonedRow(11);
    _self.teamMemberList.show();
    // drop a row for inviting a player from the table
    $('.invite-player', _self.container).click(function (evt) {
      _self._insertClonedRow(1);
    });
  };

  // display team members
  DashboardManager.prototype.showTeamMembers = function () {
    var _self = this;
    this.action = 'members';
    this.titleVerb = 'Team Members';
    this.hideAll();
    // display active nav
    this.teamHomeMenu.show();
    this.teamHomeLink.parent().addClass('active');
    this.teamMembersLink.addClass('active');
    // fetch
    this.getTeamMembers(function(members) {
      // display
      _self.teamMembersList.show();
    });
  };

  // Insert empty cloned player row into table
  DashboardManager.prototype._insertClonedRow = function (count) {
    var _self = this, i = 0;
    while (i < count) {
      var clonedRow = $('.new-player-row-clone').clone().removeClass('hide new-player-row-clone');
      $('#team-members-setup tbody').append(clonedRow);
      // make row tds editable except with class checkbox
      $('td[data-id]', clonedRow).not('.checkbox').editable({
        onEdit : _self.calculateExpenses
      });
      // set checkboxes as editables
      var checkboxes = $('td.checkbox', clonedRow);
      checkboxes.editable({
        type     : 'checkbox',
        editBy   : 'click'
      });
      i++;
    }
  };

  // Filter Members Table by typing in the search input
  DashboardManager.prototype.filterMembers = function(filter) {
    var name
      , email
      , _self = this;
    var search = new RegExp(filter, 'gi');
    // Clear Filter
    $('#team-members-setup tbody tr').each(function(index, elem) {
      $(this).show();
    });
    // Search!
    $('#team-members-setup tbody tr').each(function(index, elem) {
      name = $(elem).find('td.member-name').text();
      email = $(elem).find('td.member-email').text();
      if (!search.test(name) && !search.test(email)) {
        $(elem).hide();
      };
    });
  };

  // VIEW Player - Modal, then populate dynamically on the fly
  DashboardManager.prototype.viewPlayer = function(elem) {
    var _self = this;
    $('#modal-player').modal({});
    var memberId = $(elem).parent().parent().attr('data-id');
    // Populate View
    _self.populateAndSetData(memberId);
  };

  // UPDATE Player - Modal, then populate dynamically on the fly
  DashboardManager.prototype.updatePlayer = function(elem) {
    var _self = this;
    $('#modal-player').modal({});
    var memberId = $(elem).parent().parent().attr('data-id');
    // Populate View
    _self.populateAndSetData(memberId);
    $('#update-member-modal-btn').off('click');
    // Submit Update
    $('#update-member-modal-btn').on('click', function(evt) {
      // Build Serialized Object
      var _JSON = '{';
      $('#modal-player tr').each(function(index, elem) {
        var td = $(this).find('td:last-child');
        var attr = td.attr('data-id');
        var data = td.text();
        if (attr !== undefined && data !== '') {
          _JSON += '"' + attr + '"' + ':' + '"' + data + '",';
        };
      });
      _JSON = _JSON.slice(0, - 1) + '}';
      _JSON = $.parseJSON(_JSON);
      // Post UPDATE
      $.ajax({
        type     : 'POST',
        url      : '/user/update/' + memberId + '/',
        dataType : 'json',
        data: _JSON,
        success: function() {
          _self.displayMessage('User Succesfully Updated!');
          // Hide Modal & Refresh Users
          $('#modal-player').modal('hide');
          _self.showTeamMembers();
        },
        error: function() {
          _self.displayError('Error Updating User! Please try again later!');
        }
      });
    });
  };

  // clear call to action
  DashboardManager.prototype.clearCallToAction = function(memberId) {
    var _self = this;
    $.ajax({
      type     : 'POST',
      url      : '/user/update/' + memberId + '/',
      dataType : 'json',
      data     : JSON.stringify({ needs_team_setup : false }),
      success  : function() {
      },
      error    : function() {
        _self.displayError('Error Updating User! Please try again later!');
      }
    });
  }

  // INVITE Player - Modal
  DashboardManager.prototype.invitePlayer = function(elem) {
    var _self = this;
    var _JSON = '{';
    $('td[data-id]', elem).each(function(index, elem) {
      var attr = $(elem).attr('data-id');
      var data = $(elem).text();
      if (attr !== undefined && data !== '') {
        _JSON += '"' + attr + '"' + ':' + '"' + data + '",';
      };
    });
    _JSON = _JSON.slice(0, - 1) + '}';
    if (!/email/i.test(_JSON)) {
      _self.displayError('Email Address must be filled out!');
      return;
    };
    _JSON = $.parseJSON(_JSON);
    // Post UPDATE
    _self.displayMessage('Inviting Player...');
    $.ajax({
      type     : 'POST',
      url      : '/invite/new/',
      dataType : 'json',
      data: _JSON,
      success: function() {
        _self.displayMessage('User Succesfully Invited!');
        $(elem).remove();
      },
      error: function() {
        _self.displayError('Error Inviting User! Please try again later!');
      }
    });
  };

  // DELETe Player - Modal, then $.ajax DELETE
  DashboardManager.prototype.deletePlayerConfirm = function(elem) {
    var _self = this;
    var memberId = $(elem).parent().parent().attr('data-id');
    $('#modal-delete-member').modal({});
    $('#modal-delete-member').attr('data-id', memberId);
  };

  // Bookings Home
  DashboardManager.prototype.showBookingsHome = function() {
    this.action = 'booking';
    this.titleVerb = 'Bookings';
    this.setPath('/dashboard/bookings/');
    this.hideAll();
    this.bookingsHomeMenu.show();
    this.showCalendar();
  };

  Date.prototype.addDays = function(days) {
    var _date = new Date(this.valueOf());
    _date.setDate(_date.getDate() + days);
    return _date;
  };

  // Calendar Home
  DashboardManager.prototype.showCalendar = function() {
    var _self = this;
    this.action = 'calendar';
    this.titleVerb = 'Bookings Calendar';
    this.setPath('/dashboard/bookings/calendar/');
    this.hideAll();
    this.bookingsHomeLink.addClass('active');
    this.calendarLink.addClass('active');
    this.bookingsHomeMenu.show();
    this.calendarView.show();
    // Calendar Setup
    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();
    // Check if a calendar is already displayed
    if ($('#bookings-calendar table', this.container).length === 2) {
      $('#bookings-calendar table', this.container).html('');
    };
    // fetch calendar format events, then create calendar with events injected
    $.get('/events/all/', function(eventsFormated) {
      var i, calendaredEventsOneYear = [];
      // setup recurring events
      _.map(eventsFormated, function(item) {
        // single ocurrence
        switch (item.recurring) {
          // one time
          case 'single': 
            calendaredEventsOneYear.push(item);
            break;
          // every day
          case 'daily':
            for (i = 0; i < 365; i++) {
              var editedEvent = Object.create(item);
              editedEvent.start = new Date(editedEvent.start).addDays(i);
              editedEvent.end = new Date(editedEvent.end).addDays(i);
              calendaredEventsOneYear.push(editedEvent);
            }
            break;
          // every week
          case 'weekly':
            for (i = 0; i < 52; i++) {
              var editedEvent = Object.create(item);
              editedEvent.start = new Date(editedEvent.start).addDays(i * 7);
              editedEvent.end = new Date(editedEvent.end).addDays(i * 7);
              calendaredEventsOneYear.push(editedEvent);
            }
            break;
          // every monthly
          case 'monthly':
            for (i = 0; i < 12; i++) {
              var editedEvent = Object.create(item);
              editedEvent.start = new Date(editedEvent.start).addDays(i * 31);
              editedEvent.end = new Date(editedEvent.end).addDays(i * 31);
              calendaredEventsOneYear.push(editedEvent);
            }
            break;
        }
      });
      // setup calendar
      console.log(calendaredEventsOneYear);
      $('#calendar').fullCalendar({
        theme: false,
        header: {
          left: 'prev,next today',
          center: 'title',
          right: 'month,agendaWeek,agendaDay'
        },
        editable: true,
        selectable: true,
        selectHelper: true,
        events: calendaredEventsOneYear,
        dayClick: function(date, allDay, evt, view) {
          _self.displayEventView(date, 'add');
        },
        // Update / View Event ...
        eventClick: function(calEvent, evt, view) {
          _self.displayEventView(null, 'edit', calEvent, evt, view);
        },
        select: function(startDate, endDate, allDay, jsEvent, view) {
          // TBD
        },
        unselect: function(view, jsEvent) {
          // TBD
        },
        // Maybe Change Colors for a "hover effect" and Display a summary
        eventMouseover: function(event, jsEvent, view) {
        },
        eventMouseout: function(event, jsEvent, view) {
        },
        // On Render Event
        eventRender: function(evt, elem) {
        },
        loading: function(bool, view) { 
        }
      });
    });
    // Bind Close
    $('#trigger-event-delete-view').on('click', function(evt) {
      _self.displayDeleteEventConfirmDialog(this);
    });
    // Form submit
    $('#create-event-btn').on('click', function(evt) {
      _self.createEvent(evt);
    }); 
    // Timepickers for start and stop times
    var eventNewStart = $('#event-new-start')
      , eventNewEnd = $('#event-new-end')
    eventNewStart.timepicker({ 
      step             : 15,
      forceRoundTime   : true,
      scrollDefaultNow : true
    });
    // Set "end" for one hour later than current time
    eventNewEnd.timepicker({
      step             : 15,
      forceRoundTime   : true,
      scrollDefaultNow : true
    });
    // Change event bindings
    $('#event-new-start').on('change', function(evt) {
      _self.validateAndSetDateTime(this);
    });
    $('#event-new-end').on('change', function(evt) {
      _self.validateAndSetDateTime(this);
    });
  };

  // Event CRUD
  DashboardManager.prototype.displayEventView = function(date, type, calEvent, evt, view) {
    var _self = this;
    // Cache Current Calendar Event
    _self.currentCalendarEvent = calEvent;
    // Clear Modal Data Inputs
    // Determine View Type
    if (type === 'add') {
      _self.eventPostVerb = 'new';
      $('#modal-event')
      // Set Button Status & Text
      $('#trigger-event-delete-view').hide();
      $('#create-event-btn').text('Create');
      _self.baseDateStart = new Date(date);
      _self.baseDateEnd = new Date(date);
      // Parse our Date for a Human Readable Date
      _self.formatedDate = date
        .clearTime()
        .toString('ddd, M/d/yyyy');
      // Set clicked Calendar Date, display
      $('#create-event-form #date-event-display', this.container).text(_self.formatedDate + ': ');
      $('#create-event-form #start-event-display', this.container).text('XX');
      $('#create-event-form #end-event-display', this.container).text('XX');
      // set booked by to current user
      $('#create-event-form #booked_by', this.container).val(APP.user.profile.firstname + ' ' + APP.user.profile.lastname);
      // Init Modal for Event Addition
      $('#modal-event').modal();
      // On hide, reset all field values
      $('#modal-event').on('hide', function(evt) {
        // Reset all input[type="test"] to an empty string
        $('input[type="text"], input[type="hidden"]', this).each(function(index, elem) {
          $(elem).val('');
        });
        // Reset Selects
        $('#modal-event select :nth-child(0)').attr('selected', 'selected');
      });
    } else if (type === 'edit') {
      _self.eventPostVerb = 'update';
      // Set Modal Button Status/Text
      $('#trigger-event-delete-view').show();
      $('#create-event-btn').text('Update');
      date = new Date(calEvent._start);
      _self.baseDateStart = new Date(date);
      _self.baseDateEnd = new Date(date);
      // Parse our Date for a Human Readable Date
      _self.formatedDate = date
        .clearTime()
        .toString('ddd, M/d/yyyy');
      var start = new Date(_self.currentCalendarEvent.start)
        , end = new Date(_self.currentCalendarEvent.end);
      // Set All Current Event Data
      $('#create-event-form input[name="title"]').val(_self.currentCalendarEvent.title);
      $('#create-event-form #booked_by').val(_self.currentCalendarEvent.booked_by);
      $('#create-event-form select[name="field"]').val(_self.currentCalendarEvent.field);
      $('#create-event-form select[name="zone_type"]').val(_self.currentCalendarEvent.zone_type);
      $('#create-event-form #date-event-display', this.container).text(_self.formatedDate + ': ');
      $('#create-event-form #start-event-display', this.container).text(start.toString('h:mm:tt'));
      $('#create-event-form #end-event-display', this.container).text(end.toString('h:mm:tt'));
      $('#create-event-form #event-new-start', this.container).val(start.toString('h:mm:tt'));
      $('#create-event-form #event-new-end', this.container).val(end.toString('h:mm:tt'));
      // Set Hidden Inputs
      _self.validateAndSetDateTime($('#event-new-start'));
      _self.validateAndSetDateTime($('#event-new-end'));
      // Init Modal for Event Addition
      $('#modal-event').modal();
    } else if (type === 'delete') {
      _self.displayDeleteEventConfirmDialog(calEvent);
    };
  };

  // Display DELETE Event Dialog Confirmation
  DashboardManager.prototype.displayDeleteEventConfirmDialog = function(elem) {
    var _self = this;
    $('#modal-event').modal('hide');
    $('#modal-delete-event').modal({});
    $('#delete-booking-yes').on('click', function() {
      _self.deleteEvent(this);
      $('#delete-booking-yes').off('click');
    });
  };

  // DELETE Event
  DashboardManager.prototype.deleteEvent = function(elem) {
    $('#modal-delete-event').modal('hide');
    var _self = this
      , eventId = _self.currentCalendarEvent._id;
    // DELETE AJAX
    $.ajax({
      url : '/event/delete/' + eventId + '/',
      type : 'DELETE'
    }).done(function(result) {
      if (result.error) {
        _self.displayError(result.error);
      } else {
        _self.displayMessage('Succesfully Deleted Booking!');
        // Remove Event from Callendar & Refresh
        $('#calendar').fullCalendar('removeEvents', [eventId]);
      };
    });
  };

  // Validate the Time Interval, then set a new Date() into the hidden input based on the timepicket()
  DashboardManager.prototype.validateAndSetDateTime = function(elem) {
    var _self = this
      , id = $(elem).attr('id');
    // start
    if (id === 'event-new-start') {
      var id = $('#'+id).attr('id')
        , secondsFromMidnight = $('#'+id).timepicker('getSecondsFromMidnight')
        , time = $('#'+id).timepicker('getTime')
        , humanReadableTime = time.toString('h:mm tt')
        , display = $('#start-event-display', this.container);
      // set display on ui
      $(display).text(humanReadableTime);
      // store for later usage
      _self.eventTimeStart = _self.baseDateStart.clearTime().addSeconds(secondsFromMidnight);
      // create and set end times
      _self.eventTimeEnd = new Date(_self.eventTimeStart).addMinutes(15);
      $('#event-new-end').timepicker('setTime', _self.eventTimeEnd);
      // set end time display on ui +15 minutes
      $('#end-event-display').text(_self.eventTimeEnd.toString('h:mm tt'));
      // Set data
      var start = _self.eventTimeStart.toString('yyyy-MM-ddTHH:mm:ss');
      var end = _self.eventTimeEnd.toString('yyyy-MM-ddTHH:mm:ss');
      $('#create-event-form input#start', this.container).val(start);
      $('#create-event-form input#end', this.container).val(end);
    // end
    } else if (id === 'event-new-end') {
      var id = $('#'+id).attr('id')
        , secondsFromMidnight = $('#'+id).timepicker('getSecondsFromMidnight')
        , time = $('#'+id).timepicker('getTime')
        , humanReadableTime = time.toString('h:mm tt')
        , display = $('#end-event-display', this.container);
      // set display on ui
      $(display).text(humanReadableTime);
      // store for later usage
      _self.eventTimeEnd = _self.baseDateEnd.clearTime().addSeconds(secondsFromMidnight);
      // set data
      var end = _self.eventTimeEnd.toString('yyyy-MM-ddTHH:mm:ss');
      $('#create-event-form input#end', this.container).val(end);
    };
    // check if start and end are both set
    if (_self.eventTimeStart && _self.eventTimeEnd) {
      // validate the range
      if (_self.eventTimeStart.compareTo(_self.eventTimeEnd) !== -1) {
        // notify user and clear/focus input
        _self.displayError('Invalid Time Range!');
        var input = $(elem);
        input.val('');
        input.focus();
      };
    };
  };

  // Dynamically set the documents title on clicks
  DashboardManager.prototype.setTitle = function(verb) {
    verb = verb || this.titleVerb;
    document.title = this.baseTitle + this.titleVerb;
  };

  // If we have pushState, set the path based on a click/path
  DashboardManager.prototype.setPath = function(path) {
    if (this.hasPushstate) {
      history.pushState(null, null, path);
    };
  };

  // Fetches all Members of a Team
  DashboardManager.prototype.getTeamMembers = function(callback) {
    var HTML
      , _self = this
      , form = $('form', _self.loginForm);
    form.validate(function() {
      $.get('/team/members/all/', function(data) {
        // Cache Members for later updates etc
        _self.teamMembers = data._members;
        // Iterate over Members and build HTML - let's use a templating engine next time...
        _.map(data._members, function(member) {
          var position = (member.is_team_owner && member.position_1 !== undefined) ? member.position_1 : 'Unknown';
          var memberStatus = (member.verified_email === true) ? 'Confirmed' : 'Unconfirmed';
          var labelType = (member.verified_email === true) ? 'label-success' : 'label-warning';
          HTML += '<tr data-id="' + member._id + '">';
          HTML += '<td>' + member.email + '</td>';
          HTML += '<td>' + member.profile.firstname; + '</td>';
          HTML += '<td>' + member.profile.lastname; + '</td>';
          HTML += '<td>' + member.position + '</td>';
          // label types: label-sucess, label-warning, label
          HTML += '<td class="center"><span class="label ' + labelType + '">' + memberStatus + '</span></td>';
          HTML += '<td class="center">';
          HTML += '<a href="javascript:void(0);" class="btn btn-success orange view-player"><i class="icon-zoom-in icon-white"></i></a>';
          HTML += ' <a href="javascript:void(0);" class="btn btn-info update-player"><i class="icon-edit icon-white"></i></a>';
          HTML += ' <a href="javascript:void(0);" class="btn btn-danger delete-player"><i class="icon-trash icon-white"></i></a>';
          HTML += ' <a href="javascript:void(0);" class="btn btn-primary invite-player"><i class="icon-plus icon-green"></i></a>';
          HTML += '</td></tr>';
        });
        // Set Member HTNL
        $('#team-members tbody').prepend(HTML);
        // Apply our callback
        callback(data._members);
      });
    });
  };

  // Display ERROR message with the notifications class
  DashboardManager.prototype.displayError = function(message) {
    Notifications.push({
      text: message,
      autoDismiss: 3,
      'class': 'error'
    });
  };

  // Display success message 
  DashboardManager.prototype.displayMessage = function(message) {
    Notifications.push({
      text: message,
      autoDismiss: 3,
      time: 'just now'
    });
  };

  // Create an Event
  DashboardManager.prototype.createEvent = function(evt) {
    var route
      , message
      , _self = this;
    evt.preventDefault();
    var form = $('#create-event-form', this.container)
      , eventData = form.serialize();
    form.validate(function() {
      if (_self.eventPostVerb === 'new') {
        route = '/event/new/';
        message = 'Succesfully Added your Booking!';
      } else if (_self.eventPostVerb === 'update') {
        route = '/event/update/' + _self.currentCalendarEvent._id + '/';
        message = 'Succesfully Updated your Booking!';
      };
      $.post(route, eventData, function(result) {
        // Hide Modal First
        $('#modal-event').modal('hide');
        if (result.error) {
          _self.displayError(result.error);
        } else {
          _self.displayMessage(message);
          // set event onto calendar, and cache for later usage
          _self.newEvent = result;
          // render event, but refresh calendar for recurring events
          $('#calendar').fullCalendar('renderEvent', {
            title : result.title,
            start : result.start,
            end   : result.end,
          });
          // attempt to pay
          _self.displayMessage('Processing your Payment...'); 
          // refresh calendar
          _self.showCalendar();
        };
      });
    });
  };

  // Instantiate if needed
  (function($) {
    var needed = ($('body.dashboard-manager').length !== 0) ? true : false;
    if (needed) {
      return new DashboardManager($('body.dashboard-manager'));
    };
  })(jQuery);

}).call(this);

/* EOF */