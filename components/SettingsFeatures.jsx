import React from 'react';
import {
  Container,
  Heading,
  Text,
  List,
  ListItem,
  ListIcon,
  Box,
  Flex,
  VStack,
} from '@chakra-ui/react';
import { FaCheckCircle } from 'react-icons/fa';

const SettingsFeatures = () => {
  return (
    <Container
   
      mt="12"
      mb="32" // Added bottom margin
      p="12"
      minH="60vh"
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
    >
      <Heading className="text-2xl text-[#3A3C3E] font-bold mb-4 text-center">Upcoming Features</Heading>
      <Box textAlign="center" mb={42}>
        <Text fontSize="md" color="gray.600">
          We'll be rolling out features according to community feedback. Below are some of the upcoming ideas to improve the platform.
        </Text>
      </Box>
      <List spacing={26} textAlign="left" style={{ width: '100%' }}>
        {[
          { title: "AI based company search", description: "Search and filter investments using natural language to find the best companies to meet your goals, portfolio, or thesis." },
          { title: "New Data points", description: "More data points including annual reports and earnings calls. This will provide insight into strategy and key team members of companies." },
          { title: "Better LLMs", description: "Testing on newer models with larger context windows." },
          { title: "New Assets", description: "Expanding from ASX listed stocks into US stocks, Digital Assets, and Commodities." }
        ].map((feature, index) => (
          <ListItem key={index} p={4}> {/* Added padding to each ListItem */}
            <VStack spacing={4} align="start">
              <Flex align="center" gap={2}>
                <ListIcon as={FaCheckCircle} color="#6A849D" /> {/* Changed icon color */}
                <Text as="b">{feature.title}</Text>
              </Flex>
              <Text fontSize="sm" color="gray.600">
                {feature.description}
              </Text>
            </VStack>
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default SettingsFeatures;
