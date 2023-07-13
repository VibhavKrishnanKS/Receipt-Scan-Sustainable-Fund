import React, { useState, useEffect } from 'react';
import AWS from 'aws-sdk';
import './newpage.css';
import { FcCheckmark,FcCancel } from "react-icons/fc"

const tableName = 'user';

AWS.config.update({
  region: 'us-east-1',
  endpoint: 'dynamodb.us-east-1.amazonaws.com',
  accessKeyId: 'AKIAWU7Z6OFZFRLH2JVV',
  secretAccessKey: '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'
})

const dynamodb = new AWS.DynamoDB.DocumentClient();

const TableComponent = () => {
  const [tableData, setTableData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sRatio, setSRatio] = useState(0);
  const [nRatio,setnRatio]=useState(0);
  const [answer,setans] =useState(0);


  useEffect(() => {
    fetchTable();
  }, []);

  const fetchTable = async () => {
    try {
      const data = await dynamodb.scan({ TableName: tableName,Limit: 1,
        ScanIndexForward: false,
        FilterExpression: 'id = :i',
        ExpressionAttributeValues: {
          ':i': 3
        }
    }).promise();                                                                                                   
      const item = data.Items[0];
      const sRatio = item.S_Ratio;
      const nRatio = 100 - sRatio;
      const answer=item.Result;
      setTableData(item);
      setIsLoading(false);
      console.log(item);
      setSRatio(sRatio);
      setnRatio(nRatio);
      setans(answer)
    } catch (err) {
      console.log('Error fetching table: ', err);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }
  function isSustainable(value) {
    // Define your condition or calculation here
    return value ==="Sustainable";
  }

  return (
    
    <div>
      <div className="header">
      <h1>SUSTAINABILITY REPORT OF RECEIPT</h1>
      </div>
      <br/>
      <br/>
      <table>
        <thead>
          <tr>
            <th>LINE ITEMS</th>
            <th>SUSTAINABILITY</th>
          </tr>
        </thead>
        <tbody>
          <tr key={tableData.id}>
            <td>
            <ul>
                {tableData.Line_Items.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
            </ul>
              </td>
            <td>{tableData.S_NS.map((item, index) => (
                  <li key={index}>{item}{isSustainable(item) ? <FcCheckmark /> : <FcCancel/> }</li>
                ))}</td>
          </tr>
        </tbody>
      </table>
      
      <h3>The sustainability score of the receipt is</h3>
      <h1>{sRatio} % </h1>
      <div class='result'>
      <h3>The receipt is {answer}</h3>
      </div>
    </div>
  );
};

export default TableComponent;