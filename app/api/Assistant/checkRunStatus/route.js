import { NextRequest, NextResponse } from 'next/server';
import OpenAI from "openai";
import { TavilySearchAPIRetriever } from "langchain/retrievers/tavily_search_api";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    // Extract form data from the request
    const formData = await req.formData();
    const threadId = formData.get('threadId');
    const runId = formData.get('runId');

    // Log the received thread ID and run ID for debugging
    console.log(`CRS:`);

    console.log(`Received request with threadId: ${threadId} and runId: ${runId}`);

    // Retrieve the status of the run for the given thread ID and run ID using the OpenAI API
    const runStatus = await openai.beta.threads.runs.retrieve(threadId, runId);


  // NEW TOOL CODE: 
  // Try function here
  const tavily_search = async (query) => {
    console.log('Test Route Hit');
    console.log(query);  // Use the 'query' parameter directly

    const retriever = new TavilySearchAPIRetriever({
      k: 3, 
      apiKey: process.env.TAVILY_API_KEY,
      includeGeneratedAnswer: true, 
      includeDomains: ['finance.yahoo.com'],
      search_depth: 'advanced',
      verbose: false,
    });
  
    try {
      const docs = await retriever.getRelevantDocuments(query);
      console.log({ docs });
      const suggestedAnswerDoc = docs.find(doc => doc.metadata.title === 'Suggested Answer');
      return suggestedAnswerDoc ? suggestedAnswerDoc.pageContent : "No answer found";
    } catch (error) {
      console.error("Error in fetching documents:", error);
      throw new Error("Internal Server Error");
    }
  }

  // If runstatus.status is requires_action:
  let tools_to_call = []
  if (runStatus.status === 'requires_action') {
    console.log('TOOL CALLS:')
    tools_to_call = runStatus.required_action.submit_tool_outputs.tool_calls
    console.log(tools_to_call)
  
  let tool_output_array = []
  for (let i = 0; i < tools_to_call.length; i++) {
    const tool_call_id = tools_to_call[i].id;
    const function_name = tools_to_call[i].function.name
    const function_arg = JSON.parse(tools_to_call[i].function.arguments) // parse if it's a string

    console.log('TOOL CALL ID:');
    console.log(tool_call_id);
    console.log('FUNCTION NAME:');
    console.log(function_name);
    console.log('FUNCTION ARG:');
    console.log(function_arg);

    let output; // Initialize output for each iteration
    if (function_name === 'tavily_search'){
      output = await tavily_search(function_arg.query); // Pass the query to the function
    } else {
      output = 'Some default or error handling output'; // Handle cases where function_name is not 'fullSentence'
    }

    tool_output_array.push({'tool_call_id': tool_call_id, 'output': output });
  }

    console.log('TOOL OUTPUT ARRAY');
    console.log(tool_output_array);
    console.log(`Retrieved run status: ${runStatus.status}`);

    const run = await openai.beta.threads.runs.submitToolOutputs(
      threadId,
      runId,
      {tool_outputs: tool_output_array}
      );
      console.log('This is RUN: ', run)
  }
    // Log the retrieved run status for debugging
    console.log(`Retrieved run status: ${runStatus.status}`);

    // Return the retrieved run status as a JSON response
    return NextResponse.json({ status: runStatus.status });
  } catch (error) {
    // Log any errors that occur during the process
    console.error(`Error occurred: ${error}`);
    return NextResponse.json({ error: 'An error occurred while processing the request' });
  }
}
