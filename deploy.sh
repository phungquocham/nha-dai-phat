#!/bin/bash
npm install -g firebase-tools
firebase deploy --project $1 --only hosting --token "$2"