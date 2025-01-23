import { Project, SyntaxKind } from 'ts-morph';

const project = new Project({
  tsConfigFilePath: 'tsconfig.json', // Make sure this points to your tsconfig.json file
});

project.getSourceFiles().forEach((sourceFile) => {
  console.log(`Processing file: ${sourceFile.getFilePath()}`);

  sourceFile.forEachDescendant((node) => {
    if (
      node.getKind() === SyntaxKind.ArrowFunction ||
      node.getKind() === SyntaxKind.FunctionDeclaration ||
      node.getKind() === SyntaxKind.MethodDeclaration
    ) {
      const functionNode =
        node.asKind(SyntaxKind.FunctionDeclaration) ||
        node.asKind(SyntaxKind.ArrowFunction) ||
        node.asKind(SyntaxKind.MethodDeclaration);

      if (functionNode) {
        const signature = functionNode.getType().getCallSignatures()[0];
        if (signature) {
          const returnType = signature.getReturnType().getText();
          if (!functionNode.getReturnTypeNode()) {
            console.log(`Adding return type: ${returnType}`);
            functionNode.setReturnType(returnType);
          }
        }
      }
    }
  });

  sourceFile.saveSync(); // Save changes to the file
});

console.log('Return types added successfully!');
