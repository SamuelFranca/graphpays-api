//todo
// Create constrains


MATCH path0 = (Samuel:User {email: "samuelfranca2@gmail.com", password: "test2022", taxId: "100 000 001", country: "Portugal"})
-[:NEED_TO_PAY {dateTimeStamp: "'2015-06-24T12:50:35.556+0100'", objectId: 124537, value: 10}]
->(:User {email: "samuelfranca2@hotmail.com", password: "test2022", taxId: "100 000 000", country: "Portugal"})
-[:NEED_TO_PAY {dateTimeStamp: "'2015-06-24T12:50:35.556+0100'", objectId: 213215, value: 25}]
->(:User {email: "adm@samuelfranca.pt", password: "test2022", taxId: "100 000 002", country: "Portugal"})
-[:NEED_TO_PAY {dateTimeStamp: "'2015-06-24T12:50:35.556+0100'", objectId: 35345, value: 34}]->(Samuel)
RETURN path0