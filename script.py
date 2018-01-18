#!/usr/bin/python
# -*- coding: utf-8 -*-

real = []

with open("airports.txt") as f:
  test = f.readlines()

b = open('ap.txt', 'w')

for line in test:
    if len(line) < 20: continue
    if line.startswith("Also"): continue
    if line.startswith(" "): continue
    if "Note" in line: continue
    if "[edit]" in line: continue
    if not ":" in line: continue
    sp = line.split(":")[1]
    if line[2:4] == " :": continue

    b.write("{\"code\": \"%s\", \"name\": \"%s\"},\n" % (line[:5].strip(), sp.strip()))

print "script complete"
