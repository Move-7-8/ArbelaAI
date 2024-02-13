import {
    Button,
    Container,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Heading,
    Input,
    Text,
    Textarea,
    useToast,
  } from "@chakra-ui/react";
  import { useState } from "react";
import { FaUser, FaEnvelope, FaTag, FaCommentAlt } from 'react-icons/fa';

  const initValues = { name: "", email: "", subject: "", message: "" };
  
  const initState = { isLoading: false, error: "", values: initValues };
  
  export default function Home() {
    const toast = useToast();
    const [state, setState] = useState(initState);
    const [touched, setTouched] = useState({});
    const [nameActiveInput, setnameActiveInput] = useState('');
    const [emailActiveInput, setEmailActiveInput] = useState('');
    const [subjectActiveInput, setSubjectActiveInput] = useState('');
    const [messageActiveInput, setMessageActiveInput] = useState('');
  
    const { values, isLoading, error } = state;
  
    const onBlur = ({ target }) =>
      setTouched((prev) => ({ ...prev, [target.name]: true }));
  
    const handleChange = ({ target }) =>
      setState((prev) => ({
        ...prev,
        values: {
          ...prev.values,
          [target.name]: target.value,
        },
      }));
  
      const onSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission
        setState((prev) => ({ ...prev, isLoading: true }));
        try {
          await sendContactForm(values);
          setState({ ...initState, values: initValues }); // Reset form
          toast({
            title: "Message sent.",
            status: "success",
            duration: 2000,
            position: "top",
          });
        } catch (error) {
          setState((prev) => ({ ...prev, isLoading: false, error: error.message }));
        }
      };
      
    const sendContactForm = async (data) =>
    fetch("/api/email", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json", Accept: "application/json" },
    }).then((res) => {
        if (!res.ok) throw new Error("Failed to send message");
        return res.json();
  });
  
    return (
<Container
  maxW="70%"
  mt="12"
  p="8"
  minH="65vh"
  borderRadius="3rem"
  boxShadow="xl"
  centerContent
  bg="rgba(255, 255, 255, 0.5)"
  display="flex"
  flexDirection="column"
  alignItems="center"
  justifyContent="flex-start"
  mx="auto"
  className="custom-container"
  style={{ gap: '20px' }}
>
  <Heading  className="text-2xl text-[#3A3C3E] font-bold" mb="4">Contact Us</Heading>
  {error && (
    <Text color="red.300" my="4" fontSize="xl">
      {error}
    </Text>
  )}

  <form onSubmit={onSubmit} className="w-full" style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: '1' }}>
    <div className="flex flex-col justify-around flex-grow" style={{ gap: '10px' }}>
      {/* Name Input */}
      <FormControl isRequired isInvalid={touched.name && !values.name}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <FaUser  size={22} style={{ color: '#6A849D' }} />
          <input
            className="w-full px-4 py-2 text-sm rounded-full border focus:outline-none focus:border-red-400 bg-gray-100 text-black"
            style={{ borderWidth: "1px", height: "2.9rem", borderColor: nameActiveInput ? "rgba(255, 102, 101, 0.5)" : "transparent" }}
            type="text"
            name="name"
            placeholder="Name"
            onFocus={() => setnameActiveInput(true)}
            onBlur={() => setnameActiveInput(false)}
          />
        </div>
        <FormErrorMessage>Required</FormErrorMessage>
      </FormControl>

      {/* Email Input */}
      <FormControl isRequired isInvalid={touched.email && !values.email}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <FaEnvelope size={22} style={{ color: '#6A849D' }} />
          <input
            className="w-full px-4 py-2 text-sm rounded-full border focus:outline-none focus:border-red-400 bg-gray-100 text-black"
            style={{ borderWidth: "1px", height: "2.9rem", borderColor: emailActiveInput ? "rgba(255, 102, 101, 0.5)" : "transparent" }}
            type="email"
            name="email"
            placeholder="Email"
            onFocus={() => setEmailActiveInput(true)}
            onBlur={() => setEmailActiveInput(false)}
          />
        </div>
        <FormErrorMessage>Required</FormErrorMessage>
      </FormControl>

      {/* Subject Input */}
      <FormControl isRequired isInvalid={touched.subject && !values.subject}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <FaTag  size={22} style={{ color: '#6A849D' }} />
          <input
            className="w-full px-4 py-2 text-sm rounded-full border focus:outline-none focus:border-red-400 bg-gray-100 text-black"
            style={{ borderWidth: "1px", height: "2.9rem", borderColor: subjectActiveInput ? "rgba(255, 102, 101, 0.5)" : "transparent" }}
            type="text"
            name="subject"
            placeholder="Subject"
            onFocus={() => setSubjectActiveInput(true)}
            onBlur={() => setSubjectActiveInput(false)}
          />
        </div>
        <FormErrorMessage>Required</FormErrorMessage>
      </FormControl>

      {/* Message Input */}
      {/* Message Input */}
<FormControl isRequired isInvalid={touched.message && !values.message}>
  <div style={{ display: 'flex', alignItems: 'start', gap: '10px' }}>
    <FaCommentAlt size={22} style={{ color: '#6A849D', marginTop: '11px' }} />
    <textarea
      className="w-full text-sm rounded-full px-4 border focus:outline-none focus:border-red-400 bg-gray-100 text-black"
      style={{ 
        height: "6rem",
        borderWidth: "1px", 
        borderColor: messageActiveInput ? "rgba(255, 102, 101, 0.5)" : "transparent", 
        borderRadius: "9999px",
        resize: "none",
        paddingTop: "1rem" // Increased top padding to push down placeholder
      }}
      name="message"
      placeholder="Type your message here"
      onFocus={() => setMessageActiveInput(true)}
      onBlur={() => setMessageActiveInput(false)}
    ></textarea>
  </div>
  <FormErrorMessage>Required</FormErrorMessage>
</FormControl>


    </div>

    {/* Submit Button */}
    <div className="flex mb-4 justify-center">
      <Button
        type="submit"
        variant="solid"
        className="uppercase text-sm rounded-full py-1 px-3 w-32 transition duration-300 ease-in-out hover:scale-105 border border-[#FF6665] text-[#FF6665]"
        isLoading={isLoading}
        isDisabled={!values.name || !values.email || !values.subject || !values.message}
        rounded="lg"
        onClick={onSubmit}
      >
        Submit
        
      </Button>
    </div>
  </form>
</Container>

  );
};