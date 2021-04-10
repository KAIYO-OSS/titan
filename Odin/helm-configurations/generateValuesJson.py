import json
import os 

projectFolder = "redis"
inputFilepath = os.path.join(projectFolder, "myfile.txt")
outputFilePath = os.path.join(projectFolder, "completeValues.json")

# used in generating json data values from readme file lines
def convertReadmeToDict(Lines):
    jsonValues = []
    for line in Lines:
        l = str(line)
        l = l.split("|")
        jsonData = {}
        counter = 0
        for i in l:
            trimmed_string = "".join(i.split())
            if(trimmed_string != ""):
                counter = counter + 1
                i = i.strip()
                if(counter == 1):
                    jsonData["name"] = i.replace("`","")
                elif(counter == 2):
                    jsonData["description"] = i.replace("`","")
                else:
                    jsonData["value"] = i.replace("`","")
                    if jsonData["value"].find("nil") != -1:
                        jsonData["isRequired"] = "false"
                    else:
                        jsonData["isRequired"] = "true"
        jsonValues.append(jsonData)
    return jsonValues

# this script is used to generate the values json file from the readme raw data file
def generateCompleteValuesJsonFile():
    file = open(inputFilepath, 'r') 
    Lines = file.readlines() 
    finalJson = {}
    finalJson["values"] = convertReadmeToDict(Lines)
    with open(outputFilePath, 'w') as outfile:
        json.dump(finalJson, outfile)


# converting complete json file into required and non-required values json files
def generateSplittedValuesJsonFiles():
    with open(outputFilePath) as f:
        data = json.load(f)
    valuesList = data["values"]
    requiredValues = []
    nonRequiredValues = []
    for value in valuesList:
        v = value["value"]
        des = value["description"]
        v = v.split("(")
        if(len(v) == 2):
            value["value"] = v[0].strip()
            value["description"] = des + " (" + v[1]
        if(value["isRequired"] == "true"):
            requiredValues.append(value)
        else:
            nonRequiredValues.append(value)
    
    finalJson = {}
    finalJson["values"] = requiredValues
    path = os.path.join(projectFolder,"requiredValues.json")
    with open(path, 'w') as outfile:
        json.dump(finalJson, outfile)
    
    finalJson = {}
    finalJson["values"] = nonRequiredValues
    path = os.path.join(projectFolder,"nonRequiredValues.json")
    with open(path, 'w') as outfile:
        json.dump(finalJson, outfile)


def main():
    generateCompleteValuesJsonFile()
    generateSplittedValuesJsonFiles()

if __name__ == "__main__":
    main()


 