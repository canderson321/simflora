import turtle
from random import *

newstring = input("Enter Input: ")
numtimes = int(newstring[0])

print(str(numtimes))
print(len(newstring))

pos = []
ang = []
size = []
penSize = 20
        
t = turtle.Turtle()
t.pu()
t.sety(-300)
t.pd()
t.left(90)
t.speed(1000)
t.color("#00ff00")
t.width(0.1)

dist = 250.0
for i in range(0, numtimes):
    dist = dist / 2.0

length = len(newstring)
i = 0
while i < length:
    c = newstring[i]
    #print(str(i) + " " + c + " " + str(len(pos)))
    j = i
    while j < length and newstring[j] is c:
        j = j + 1
    n = j - i
    i = j
    
    if c is "F":
        t.forward(dist * n)
    elif c is "X":
        t.forward(dist)
    elif c is "-":
        t.left(25 * n)
    elif c is "+":
        t.right(25 * n)
    elif c is "[":
        for k in range(0, n): 
            pos.append(t.pos())
            ang.append(t.heading())
            size.append(penSize)
            penSize = penSize * 0.5
            t.width(penSize)
    elif c is "]":
        for k in range(0, n): 
            t.pu()
            p = pos.pop()
            t.setposition(p[0], p[1])
            t.setheading(ang.pop())
            t.pd()
            penSize = size.pop()
            t.width(penSize)
    elif c is "R":
        t.right(randint(-55, 55) * n)
    elif c is "r":
        t.right(randint(-15, 15) * n)
    else:
        print("Character " + c + " skipped")
        


        
turtle.Screen().exitonclick()
        
        
        