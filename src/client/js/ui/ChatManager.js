/*
 * @author ohmed, biven
 * DatTank UI file
*/

Game.ChatManager = function () {

    // nothing here

};

Game.ChatManager.prototype = {};

//

Game.ChatManager.prototype.init = function () {

    this.openedMenu = false;

    $('.input-message').keypress( this.typingMessage.bind( this ) );
    $( document ).keypress( this.openCloseMessage.bind( this ) );

};

Game.ChatManager.prototype.typingMessage = function ( event ) {

    if ( event.keyCode === 13 && $('.input-message').val() !== '' ) {

        this.sendMessage();
        this.openedMenu = true;
        return false;

    } else if ( event.keyCode === 13 && $('.input-message').val() === '' ) {

        this.exitMessageContainer();
        this.openedMenu = false;
        return false;

    }

};

Game.ChatManager.prototype.openCloseMessage = function ( event ) {

    if ( event.keyCode === 13 && this.openedMenu === false ) {

        this.showMessageContainer();
        this.openedMenu = true;

        $('.input-message').focus();
        return false;

    } else if ( event.keyCode === 13 && this.openedMenu === true ) {

        this.exitMessageContainer();
        this.openedMenu = false;
        return false;

    }

};

Game.ChatManager.prototype.showMessageContainer = function () {

    $('.chatter').show();
    $('#kill-events').hide();

};

Game.ChatManager.prototype.exitMessageContainer = function () {

    $('.chatter').hide();
    $('#kill-events').show();

};

Game.ChatManager.prototype.sendMessage = function () {

    this.showMessageContainer();

    var login = localStorage.getItem('login');
    var message = $('.input-message').val();

    if ( $('.input-message').val() !== '' ) {

        network.send( 'SendChatMessage', false, { login: login, message: message } );

    }

    if ( $('chatter-list .message-container').children().length > 6 ) {

        $('.message-container div:child(7)').hide();

    }

    $('.input-message').val('');

};

Game.ChatManager.prototype.newMessage = function ( login, message, teamId ) {

    var team = Game.arena.teamManager.getById( teamId );

    this.showMessageContainer();

    $('.message-container').prepend(
        '<div class="user-label-message">\
            <div class="user-message">\
            <a class="input-text_a"><span style="color: ' + team.color + ' ">'+ login + '</span>' + ": " + message + '</a>\
        </div>'
    );

};