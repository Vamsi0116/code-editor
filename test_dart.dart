void main() {
  print('Hello, Dart!');
  
  // Variables and types
  String name = 'World';
  int age = 25;
  double height = 5.9;
  bool isActive = true;
  
  print('Name: $name');
  print('Age: $age');
  print('Height: $height');
  print('Active: $isActive');
  
  // List example
  List<String> fruits = ['Apple', 'Banana', 'Orange'];
  print('Fruits: $fruits');
  
  // Function call
  String greeting = greet('Dart Developer');
  print(greeting);
  
  // Class example
  Person person = Person('Alice', 30);
  person.introduce();
  
  // Loop example
  print('Counting to 5:');
  for (int i = 1; i <= 5; i++) {
    print('Count: $i');
  }
}

String greet(String name) {
  return 'Hello, $name! Welcome to Dart programming.';
}

class Person {
  String name;
  int age;
  
  Person(this.name, this.age);
  
  void introduce() {
    print('Hi, I\'m $name and I\'m $age years old.');
  }
}
