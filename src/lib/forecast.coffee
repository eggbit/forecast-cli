###
 API Docs: https://developer.darkskyapp.com/docs/v2
###
geocoder = require('geocoder')
colors = require('colors')
moment = require('moment')
Client = require('request-json').JsonClient
client = new Client('https://api.forecast.io/forecast/f5951365c265a47ef82e6f1bdd33109e/')
defaults = require './defaults'

if (typeof String::rpad != 'function')
    String::rpad = (padString, length) ->
        str = this
        while str.length < length
            str = str + padString
        return str

addColorToSummary = (summary) ->
    parts = []
    words = summary.split(' ')
    for word in words
        if word.toLowerCase() in ['rain', 'rain,', 'rain.']
            rains = word.split /[\.,]/
            parts.push rains[0].blue
        else if word.toLowerCase() in ['sprinkling', 'sprinkling,', 'sprinkling.']
            rains = word.split /[\.,]/
            parts.push rains[0].cyan
        else
            parts.push word
    return parts.join(' ')

formatTemperature = (temperature) ->
    (String(parseInt(temperature)) + '°').rpad(' ', 3).bold

header = (formattedAddress) ->
    console.log formattedAddress.bold

signoff = ->
    console.log ''
    console.log 'Now you are prepared.'.grey
    console.log ''

hourlyDayHeading = (day) ->
    console.log day.bold

displayHourly = (hourly) ->
    if hourly
        hourlyDayHeading 'Today'
        for hour in hourly.data
            time = new moment(hour.time * 1000)
            if time.hour() > 7 and time.hour() <= 22
                if time.hour() == 8
                    if moment().day() isnt time.day()
                        console.log ''
                        hourlyDayHeading time.format('dddd')
                console.log "#{time.format('ha').rpad(' ', 4).red} #{formatTemperature(hour.temperature)} #{addColorToSummary(hour.summary)} "
        console.log ''
        # signoff()

displayDaily = (daily, hourly, minutely) ->
    if daily
        console.log moment().format("DD MMMM YYYY hh:mma")
        console.log ''
        console.log "Forecast".bold
        console.log minutely.summary.green
        console.log hourly.summary.green
        console.log daily.summary.green
        console.log ''

        for day in daily.data
            date = new moment(day.time * 1000)
            maxTime = new moment(day.temperatureMaxTime * 1000)
            if moment().dayOfYear() is date.dayOfYear()
                console.log "Today".red + " #{formatTemperature(day.temperatureMax)} #{addColorToSummary(day.summary)}"
            else
                console.log "#{date.format('ddd').red} #{formatTemperature(day.temperatureMax)} #{addColorToSummary(day.summary)}"
        console.log ''
        # signoff()

exports.get = (place, hourly = false) ->
    geocoder.geocode(place, (err, data) ->
        address = data?.results?[0]
        if location = address?.geometry?.location
            client.get("#{location.lat},#{location.lng}?units=#{defaults.units()}&exclude=alerts", (err, res, body) ->
                if err
                    console.log err
                else
                    header(address?.formatted_address)
                    if hourly
                        displayHourly body?.hourly
                    else
                        displayDaily body?.daily, body?.hourly, body?.minutely
            )
        else
            console.log "I can't find your location. Please forgive me."
    )
